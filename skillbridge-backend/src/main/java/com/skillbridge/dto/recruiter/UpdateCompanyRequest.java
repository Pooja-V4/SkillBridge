package com.skillbridge.dto.recruiter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCompanyRequest {
    private String name;
    private String industry;
    private String websiteUrl;
    private String location;
    private String description;
    private String logoUrl;
}
