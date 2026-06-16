package com.sarkariresult.clone.repository;

import com.sarkariresult.clone.model.UploadedPdf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UploadedPdfRepository extends JpaRepository<UploadedPdf, Long> {
}
