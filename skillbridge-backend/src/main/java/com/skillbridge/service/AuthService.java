package com.skillbridge.service;

import com.skillbridge.dto.auth.AuthResponse;
import com.skillbridge.dto.auth.LoginRequest;
import com.skillbridge.dto.auth.RegisterRequest;
import com.skillbridge.dto.auth.UserProfileResponse;
import com.skillbridge.entity.*;
import com.skillbridge.enums.RoleType;
import com.skillbridge.repository.*;
import com.skillbridge.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final RecruiterRepository recruiterRepository;
    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            FacultyRepository facultyRepository,
            RecruiterRepository recruiterRepository,
            DepartmentRepository departmentRepository,
            CompanyRepository companyRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.recruiterRepository = recruiterRepository;
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @jakarta.annotation.PostConstruct
    @Transactional
    public void seedAdminAccount() {
        if (!userRepository.existsByEmail("admin@skillbridge.edu")) {
            User admin = User.builder()
                    .email("admin@skillbridge.edu")
                    .password(passwordEncoder.encode("Admin@123"))
                    .firstName("System")
                    .lastName("Administrator")
                    .role(RoleType.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with email " + request.getEmail() + " already exists.");
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .phone(request.getPhone())
                .role(request.getRole())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        // Initialize role-specific profile
        if (request.getRole() == RoleType.STUDENT) {
            Department dept = null;
            if (request.getDepartmentCode() != null) {
                dept = departmentRepository.findByCode(request.getDepartmentCode()).orElse(null);
            }
            Student student = Student.builder()
                    .user(savedUser)
                    .rollNumber(request.getRollNumber())
                    .department(dept)
                    .academicYear(request.getAcademicYear() != null ? request.getAcademicYear() : 3)
                    .cgpa(request.getCgpa() != null ? request.getCgpa() : 0.0)
                    .build();
            studentRepository.save(student);
        } else if (request.getRole() == RoleType.FACULTY) {
            Department dept = null;
            if (request.getDepartmentCode() != null) {
                dept = departmentRepository.findByCode(request.getDepartmentCode()).orElse(null);
            }
            Faculty faculty = Faculty.builder()
                    .user(savedUser)
                    .department(dept)
                    .designation(request.getDesignation() != null ? request.getDesignation() : "Faculty Member")
                    .build();
            facultyRepository.save(faculty);
        } else if (request.getRole() == RoleType.RECRUITER) {
            Company company = null;
            if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
                company = companyRepository.findByName(request.getCompanyName())
                        .orElseGet(() -> companyRepository.save(Company.builder().name(request.getCompanyName()).build()));
            }
            Recruiter recruiter = Recruiter.builder()
                    .user(savedUser)
                    .company(company)
                    .designation(request.getDesignation() != null ? request.getDesignation() : "Recruiter")
                    .build();
            recruiterRepository.save(recruiter);
        }

        String jwtToken = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().trim().toLowerCase(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserProfileResponse.UserProfileResponseBuilder builder = UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole());

        if (user.getRole() == RoleType.STUDENT) {
            studentRepository.findByUserId(user.getId()).ifPresent(student -> {
                builder.profileId(student.getId());
                builder.cgpa(student.getCgpa());
                if (student.getDepartment() != null) {
                    builder.department(student.getDepartment().getName());
                }
            });
        } else if (user.getRole() == RoleType.FACULTY) {
            facultyRepository.findByUserId(user.getId()).ifPresent(faculty -> {
                builder.profileId(faculty.getId());
                if (faculty.getDepartment() != null) {
                    builder.department(faculty.getDepartment().getName());
                }
            });
        } else if (user.getRole() == RoleType.RECRUITER) {
            recruiterRepository.findByUserId(user.getId()).ifPresent(recruiter -> {
                builder.profileId(recruiter.getId());
                if (recruiter.getCompany() != null) {
                    builder.company(recruiter.getCompany().getName());
                }
            });
        }

        return builder.build();
    }
}
