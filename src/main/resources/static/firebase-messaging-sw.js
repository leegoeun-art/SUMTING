self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }
  const type = payload?.data?.type;
  const title = payload?.data?.title ?? "숨팅 알림";
  const body = payload?.data?.body;
  const url = type === "chat" ? "/chat" : "/heartpings";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      if (type === "chat" && windowClients.some((c) => c.url.includes("/chat"))) return;

      return self.registration.showNotification(title, {
        body,
        icon: "/heartmoong.png",
        data: { type, url },
      });
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const { url } = event.notification.data ?? {};
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const existing = windowClients.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(url ?? "/heartpings");
      } else {
        clients.openWindow(url ?? "/heartpings");
      }
    })
  );
});
