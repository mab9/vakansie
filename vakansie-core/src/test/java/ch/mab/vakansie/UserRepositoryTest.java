package ch.mab.vakansie;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

import ch.mab.vakansie.groups.Group;
import ch.mab.vakansie.groups.GroupProject;
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import ch.mab.vakansie.util.TestUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

@DataJpaTest
@Transactional
public class UserRepositoryTest extends TestUtil {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void createUser() {
        User mab = createUser("mab");
        User mabPersisted = userRepository.save(mab);

        assertThat(mabPersisted, notNullValue());
        assertThat(mabPersisted.getId(), notNullValue());
        assertThat(mabPersisted, is(equalTo(mab)));
        assertThat(mab.getGroups(), empty());
    }

    @Test
    public void createUser_addNonPersistedGroup_fromInverseSide() {
        Group project = new GroupProject();
        project.setName("SIE");

        User mab = createUser("mab");
        mab.addToGroup(project);

        User mabPersisted = userRepository.save(mab);

        assertThat(mabPersisted, notNullValue());
        assertThat(mabPersisted.getId(), notNullValue());
        assertThat(mabPersisted, is(equalTo(mab)));
    }
}
