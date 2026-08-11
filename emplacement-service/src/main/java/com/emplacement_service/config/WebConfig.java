package com.emplacement_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String uploadDir;

    public WebConfig(@Value("${upload.dir}") String uploadDir) {
        this.uploadDir = uploadDir;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolute = new java.io.File(uploadDir).getAbsolutePath().replace("\\", "/");
        if (!absolute.endsWith("/")) {
            absolute += "/";
        }
        registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + absolute);
    }
}
