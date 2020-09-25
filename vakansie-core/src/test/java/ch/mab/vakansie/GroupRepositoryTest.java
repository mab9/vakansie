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
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import ch.mab.vakansie.util.TestUtil;
import java.util.List;
import javax.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.transaction.TestTransaction;

@SpringBootTest
@Transactional
public class GroupRepositoryTest extends TestUtil {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Test
    public void createProjectGroup() {
        Group group = createProject("SVV");
        Group createdGroup = groupRepository.save(group);

        assertThat(createdGroup, notNullValue());
        assertThat(createdGroup.getId(), notNullValue());
        assertThat(createdGroup.getName(), comparesEqualTo(group.getName()));
        assertThat(createdGroup.getUsers(), empty());
    }

    @Test
    public void updateGroup_addNonPersistedUser_fromInverseSide() {
        Group group = createProject("SVV");
        Group createdGroup = groupRepository.save(group);
        assertThat(createdGroup.getUsers(), empty());

        User mab = createUser("mab");
        createdGroup.addUser(mab);

        List<User> users = userRepository.findAll();
        assertThat(users, hasSize(0));
    }

    @Test
    public void updateGroup_addPersistedUser_fromInverseSide() {
        Group group = createProject("SVV");
        Group persistedGroup = groupRepository.save(group);
        assertThat(persistedGroup.getUsers(), empty());

        User mab = createUser("mab");
        User persistedMab = userRepository.save(mab);

        persistedGroup.addUser(persistedMab);

        List<User> users = userRepository.findAll();
        assertThat(users, hasSize(1));
        assertThat(users, contains(persistedMab));

        assertThat(persistedGroup.getVersion(), equalTo(0L)); // because the update is in the same transaction.
    }
}
