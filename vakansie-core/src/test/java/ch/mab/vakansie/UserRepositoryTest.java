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
import ch.mab.vakansie.groups.GroupProject;
import ch.mab.vakansie.users.Permissions;
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import ch.mab.vakansie.util.TestUtil;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class UserRepositoryTest extends TestUtil {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void createUser() {
        User mab = createUser("mab");
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
        Group project = new GroupProject();
        project.setName("SIE");

        User mab = createUser("mab");
        mab.addToGroup(project);

        User createdMab = userRepository.save(mab);

        assertThat(createdMab, notNullValue());
        assertThat(createdMab.getId(), notNullValue());
        assertThat(createdMab.getName(), comparesEqualTo(mab.getName()));
        assertThat(createdMab.getEmail(), comparesEqualTo(mab.getEmail()));
        assertThat(createdMab.getGroups(), contains(project));
        assertThat(createdMab.getPermission(), is(equalTo(Permissions.USER)));
    }

    @Test
    public void createMultipleUsers_WithSameGroup() {
        Group team = new GroupProject();
        team.setName("SIE");

        User mab = createUser("mab");
        mab.addToGroup(team);

        User foo = createUser("foo");
        foo.addToGroup(team);

        User createdMab = userRepository.save(mab);
        User createdFoo = userRepository.save(foo);

        assertThat(createdMab.getGroups(), contains(team));
        assertThat(createdFoo.getGroups(), contains(team));
    }

    @Test
    public void findUsers_withSameGroup() {
        Group projectA = new GroupProject();
        projectA.setName("SVV");

        Group projectB = new GroupProject();
        projectB.setName("DAB");

        User mab = createUser("mab");
        mab.addToGroup(projectA);

        User foo = createUser("foo");
        foo.addToGroup(projectA);

        User lad = createUser("lad");
        lad.addToGroup(projectB);

        User createdMab = userRepository.save(mab);
        User createdFoo = userRepository.save(foo);
        User createdLad = userRepository.save(lad);

        assertThat(createdMab.getGroups(), contains(projectA));
        assertThat(createdFoo.getGroups(), contains(projectA));
        assertThat(createdLad.getGroups(), contains(projectB));

        List<User> users = userRepository.findUserByGroupsIn(Collections.singleton(projectB));
        assertThat(users, hasSize(1));
        assertThat(users, contains(lad));
    }
}
