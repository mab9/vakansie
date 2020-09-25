package ch.mab.vakansie.util;

import ch.mab.vakansie.groups.GroupProject;
import ch.mab.vakansie.groups.GroupRepository;
import ch.mab.vakansie.groups.GroupTeam;
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public abstract class TestUtil {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    protected User createUser(String name) {
        User user = new User();
        user.setName(name);
        user.setEmail(name + "@vakansie.com");
        return user;
    }

    protected User createUserAndPersist(String name) {
        User user = createUser(name);
        return userRepository.save(user);
    }

    protected GroupTeam createTeam(String name, User admin) {
        GroupTeam group = new GroupTeam();
        group.setName(name);
        //group.setAdmin(admin);
        return group;
    }

    protected GroupTeam createTeamAndPersist(String name, User admin) {
        GroupTeam team = createTeam(name, admin);
        return groupRepository.save(team);
    }

    protected GroupProject createProject(String name) {
        GroupProject group = new GroupProject();
        group.setName(name);
        return group;
    }

    protected GroupProject createProjectAndPersist(String name) {
        GroupProject team = createProject(name);
        return groupRepository.save(team);
    }
}
