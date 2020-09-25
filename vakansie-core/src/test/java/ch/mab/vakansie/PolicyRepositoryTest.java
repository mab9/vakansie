package ch.mab.vakansie;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

import ch.mab.vakansie.groups.GroupTeam;
import ch.mab.vakansie.groups.Policy;
import ch.mab.vakansie.groups.PolicyMinAvailableUser;
import ch.mab.vakansie.groups.PolicyRepository;
import ch.mab.vakansie.util.TestUtil;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class PolicyRepositoryTest extends TestUtil {

    @Autowired
    private PolicyRepository policyRepository;

    @Test
    public void createDefaultPolicy() {
        Policy policy = new PolicyMinAvailableUser();
        policy.setName("defaultPolicy");
        Policy policyPersisted = policyRepository.save(policy);

        assertThat(policyPersisted, notNullValue());
        assertThat(policyPersisted.getId(), notNullValue());
        assertThat(policyPersisted, is(equalTo(policy)));
    }

    @Test
    public void createPolicy_differentStartEnd() {
        Policy policy = new PolicyMinAvailableUser();
        policy.setName("policy");
        policy.setStart(LocalDate.now());
        policy.setStart(LocalDate.now().plusDays(4));
        Policy policyPersisted = policyRepository.save(policy);

        assertThat(policyPersisted, notNullValue());
        assertThat(policyPersisted.getId(), notNullValue());
        assertThat(policyPersisted, is(equalTo(policy)));
    }
}
