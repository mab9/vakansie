package ch.mab.vakansie.users;

import ch.mab.vakansie.groups.Group;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(User newUser) {
        User user = userRepository.findByIdAndVersion(newUser.getId(), newUser.getVersion());
        return newUser;
    }

    public Optional<User> findUserById(UUID id) {
        return userRepository.findById(id);
    }

    public Collection<User> findUsersByGroups(Collection<Group> groups) {
        return userRepository.findUserByGroupsIn(new ArrayList<>(groups));
    }
}
