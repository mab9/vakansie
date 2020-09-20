package ch.mab.vakansie;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.comparesEqualTo;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;

import ch.mab.vakansie.groups.Group;
import ch.mab.vakansie.groups.GroupRepository;
import ch.mab.vakansie.groups.GroupTeam;
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import java.util.Collections;
import java.util.List;
import javax.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.Assert;

@SpringBootTest
@Transactional
public class GroupRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Test
    public void createGroup() {
        Group team = new GroupTeam();
        team.setName("SIE");

        Group createdTeam = groupRepository.save(team);

        assertThat(createdTeam, notNullValue());
        assertThat(createdTeam.getId(), notNullValue());
        assertThat(createdTeam.getName(), comparesEqualTo(team.getName()));
        assertThat(createdTeam.getUsers(), empty());
    }

    @Test
    public void updateGroup_addNonPersistedUser_fromInverseSide() {
        Group team = new GroupTeam();
        team.setName("SIE");

        Group createdTeam = groupRepository.save(team);
        assertThat(createdTeam.getUsers(), empty());

        User mab = new User();
        mab.setEmail("mab9@gmail.com");
        mab.setName("mab");

        createdTeam.addUser(mab);

        List<User> users = userRepository.findAll();
        assertThat(users, hasSize(0));
    }

    @Test
    public void updateGroup_addPersistedUser_fromInverseSide() {
        Group team = new GroupTeam();
        team.setName("SIE");

        Group createdTeam = groupRepository.save(team);
        assertThat(createdTeam.getUsers(), empty());

        User mab = new User();
        mab.setEmail("mab9@gmail.com");
        mab.setName("mab");
        User createdMab = userRepository.save(mab);

        createdTeam.addUser(createdMab);

        List<User> users = userRepository.findAll();
        assertThat(users, hasSize(1));
        assertThat(users, contains(createdMab));

        assertThat(createdTeam.getVersion(), equalTo(0L)); // because the update is in the same transaction.
    }
}
