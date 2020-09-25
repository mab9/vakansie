package ch.mab.vakansie;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.notNullValue;

import ch.mab.vakansie.users.User;
import ch.mab.vakansie.util.TestUtil;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class GroupServiceImplTest extends TestUtil {

    @Test
    public void createGroup() {
        User mab = createUserAndPersist("mab");

        assertThat(mab, notNullValue());
        assertThat(mab.getId(), notNullValue());
    }
}
