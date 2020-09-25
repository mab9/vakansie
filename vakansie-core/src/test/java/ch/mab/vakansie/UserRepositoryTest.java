package ch.mab.vakansie;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.comparesEqualTo;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

import ch.mab.vakansie.groups.Group;
import ch.mab.vakansie.groups.GroupTeam;
import ch.mab.vakansie.users.Permissions;
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void createUser() {
        User mab = new User();
        mab.setEmail("mab9@gmail.com");
        mab.setName("mab");
        User createdMab = userRepository.save(mab);

        assertThat(createdMab, notNullValue());
        assertThat(createdMab.getId(), notNullValue());
        assertThat(mab.getName(), comparesEqualTo(createdMab.getName()));
        assertThat(mab.getEmail(), comparesEqualTo(createdMab.getEmail()));
        assertThat(mab.getGroups(), empty());
        assertThat(createdMab.getPermission(), is(equalTo(Permissions.USER)));
    }

    @Test
    public void createUserWithGroup() {
        Group team = new GroupTeam();
        team.setName("SIE");

        User mab = new User();
        mab.setEmail("mab9@gmail.com");
        mab.setName("mab");
        mab.addToGroup(team);

        User createdMab = userRepository.save(mab);

        assertThat(createdMab, notNullValue());
        assertThat(createdMab.getId(), notNullValue());
        assertThat(createdMab.getName(), comparesEqualTo(mab.getName()));
        assertThat(createdMab.getEmail(), comparesEqualTo(mab.getEmail()));
        assertThat(createdMab.getGroups(), contains(team));
        assertThat(createdMab.getPermission(), is(equalTo(Permissions.USER)));
    }

    @Test
    public void createMultipleUsers_WithSameGroup() {
        Group team = new GroupTeam();
        team.setName("SIE");

        User mab = new User();
        mab.setEmail("mab9@gmail.com");
        mab.setName("mab");
        mab.addToGroup(team);

        User foo = new User();
        foo.setEmail("foo@gmail.com");
        foo.setName("foo");
        foo.addToGroup(team);

        User createdMab = userRepository.save(mab);
        User createdFoo = userRepository.save(foo);

        assertThat(createdMab.getGroups(), contains(team));
        assertThat(createdFoo.getGroups(), contains(team));
    }

    @Test
    public void findUsers_withSameGroup() {
        Group teamA = new GroupTeam();
        teamA.setName("SIE");

        Group teamB = new GroupTeam();
        teamA.setName("STE");

        User mab = new User();
        mab.setEmail("mab9@gmail.com");
        mab.setName("mab");
        mab.addToGroup(teamA);

        User foo = new User();
        foo.setEmail("foo@gmail.com");
        foo.setName("foo");
        foo.addToGroup(teamA);

        User lad = new User();
        lad.setEmail("lad@gmail.com");
        lad.setName("lad");
        lad.addToGroup(teamB);

        User createdMab = userRepository.save(mab);
        User createdFoo = userRepository.save(foo);
        User createdLad = userRepository.save(lad);

        assertThat(createdMab.getGroups(), contains(teamA));
        assertThat(createdFoo.getGroups(), contains(teamA));
        assertThat(createdLad.getGroups(), contains(teamB));

        List<User> users = userRepository.findUserByGroupsIn(Collections.singleton(teamB));
        assertThat(users, hasSize(1));
        assertThat(users, contains(lad));
    }
}
