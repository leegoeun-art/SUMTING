package org.example.sumting.repository;

import org.example.sumting.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {

    @Modifying
    @Query("DELETE FROM Report r WHERE r.reporterId = :userId OR r.reportedId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
