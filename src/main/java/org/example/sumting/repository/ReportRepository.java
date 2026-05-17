package org.example.sumting.repository;

import org.example.sumting.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("SELECT r.reportedId FROM Report r WHERE r.reporterId = :userId")
    List<Long> findReportedIdsByReporterId(@Param("userId") Long userId);

    @Query("SELECT r.reporterId FROM Report r WHERE r.reportedId = :userId")
    List<Long> findReporterIdsByReportedId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Report r WHERE r.reporterId = :userId OR r.reportedId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
