package ch.mab.vakansie.base;

import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;

/*
    Documentation: https://springfox.github.io/springfox/docs/current/#maven
 */
@Configuration
@EnableSwagger2WebMvc
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2).select()
                                                      .apis(RequestHandlerSelectors.any())
                                                      .paths(PathSelectors.any())
                                                      .build()
                                                      .pathMapping("/")
                                                      .apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {
        return new ApiInfo("Vakansie rest api doc", "Vaction planer", "1.0",
                           "Terms of service", new Contact("mab", "www.mab.rocks", "marcantoine.bruelhart@gmail.com"),
                           "GNU GENERAL PUBLIC LICENSE\n"
                               + "                       Version 3, 29 June 2007", "https://www.gnu.org/licenses", Collections.emptyList());
    }
}