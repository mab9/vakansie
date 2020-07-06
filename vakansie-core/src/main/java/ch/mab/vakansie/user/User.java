package ch.mab.vakansie.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("users")
public class User {

    @GetMapping
    public String getUsers() {
        return "all users";
    }
}
