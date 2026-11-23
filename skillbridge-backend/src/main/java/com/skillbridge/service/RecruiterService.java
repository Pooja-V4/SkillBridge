package com.skillbridge.service;

import com.skillbridge.dto.recruiter.CompanyResponse;
import com.skillbridge.dto.recruiter.UpdateCompanyRequest;
import com.skillbridge.entity.Company;
import com.skillbridge.entity.Recruiter;
import com.skillbridge.entity.User;
import com.skillbridge.repository.CompanyRepository;
import com.skillbridge.repository.RecruiterRepository;
import com.skillbridge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public RecruiterService(
            RecruiterRepository recruiterRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository
    ) {
        this.recruiterRepository = recruiterRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public CompanyResponse updateCompany(String email, UpdateCompanyRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        Company company = recruiter.getCompany();
        if (company == null) {
            company = new Company();
            company.setName(req.getName() != null ? req.getName().trim() : "My Company");
        }

        if (req.getName() != null) company.setName(req.getName().trim());
        if (req.getIndustry() != null) company.setIndustry(req.getIndustry().trim());
        if (req.getWebsiteUrl() != null) company.setWebsiteUrl(req.getWebsiteUrl().trim());
        if (req.getLocation() != null) company.setLocation(req.getLocation().trim());
        if (req.getDescription() != null) company.setDescription(req.getDescription().trim());
        if (req.getLogoUrl() != null) company.setLogoUrl(req.getLogoUrl().trim());

        Company savedCompany = companyRepository.save(company);
        recruiter.setCompany(savedCompany);
        recruiterRepository.save(recruiter);

        return CompanyResponse.builder()
                .id(savedCompany.getId())
                .name(savedCompany.getName())
                .industry(savedCompany.getIndustry())
                .websiteUrl(savedCompany.getWebsiteUrl())
                .location(savedCompany.getLocation())
                .description(savedCompany.getDescription())
                .logoUrl(savedCompany.getLogoUrl())
                .build();
    }
}
