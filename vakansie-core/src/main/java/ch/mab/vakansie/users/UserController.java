package ch.mab.vakansie.users;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("depricated")
    public String getUsers() {
        return "all users";
    }

    @GetMapping
    public ResponseEntity<List<User>> findAllUsers() {
        List<User> all = userService.findAll();
        return ResponseEntity.of(Optional.of(all));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.of(Optional.of(userService.createUser(user)));
    }
}
