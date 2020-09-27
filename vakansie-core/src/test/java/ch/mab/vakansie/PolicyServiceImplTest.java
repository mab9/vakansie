package ch.mab.vakansie;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.notNullValue;
    import static org.hamcrest.Matchers.is;

import ch.mab.vakansie.groups.Group;
import ch.mab.vakansie.groups.GroupServiceImpl;
import ch.mab.vakansie.groups.GroupSpace;
import ch.mab.vakansie.policies.Policy;
import ch.mab.vakansie.policies.PolicyService;
import ch.mab.vakansie.policies.PolicyServiceImpl;
import ch.mab.vakansie.users.User;

import ch.mab.vakansie.util.TestUtil;
import java.util.Optional;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class PolicyServiceImplTest extends TestUtil {

    @Autowired
    private PolicyServiceImpl policyService;

    @Autowired
    private GroupServiceImpl groupService;

    @Test
    public void createPolicy_forGivenGroup() {
        GroupSpace group = createSpace("SIE");
        group = groupService.createSpace(group, group.getOwner());

        Policy policy = createMinAvailabeUserPolicy("Eastern min 2 employees", 2);
        policy = policyService.createPolicyForGroup(policy, group.getId());

        Optional<Group> currentGroup = groupService.findById(group.getId());
        assertThat(currentGroup.get().getPolicies().contains(policy), is(true));
    }

    @Test
    public void findPolicies_forGivenGroup() {
        GroupSpace group = createSpace("SIE");
        group = groupService.createSpace(group, group.getOwner());

        Policy policy = createMinAvailabeUserPolicy("Eastern min 2 employees", 2);
        policy = policyService.createPolicyForGroup(policy, group.getId());

        Policy policy2 = createMinAvailabeUserPolicy("Cristmas min 2 employees", 2);
        policy2 = policyService.createPolicyForGroup(policy2, group.getId());

        Optional<Group> currentGroup = groupService.findById(group.getId());
        assertThat(currentGroup.get().getPolicies().contains(policy), is(true));
        assertThat(currentGroup.get().getPolicies().contains(policy2), is(true));
    }

    @Disabled
    @Test
    public void removePolicy_forGivenGroup() {
        GroupSpace group = createSpace("SIE");
        group = groupService.createSpace(group, group.getOwner());

        Policy policy = createMinAvailabeUserPolicy("Eastern min 2 employees", 2);
        policy = policyService.createPolicyForGroup(policy, group.getId());

        Policy policy2 = createMinAvailabeUserPolicy("Cristmas min 2 employees", 2);
        policy2 = policyService.createPolicyForGroup(policy2, group.getId());

        Optional<Group> currentGroup = groupService.findById(group.getId());
        assertThat(currentGroup.get().getPolicies().contains(policy), is(true));
        assertThat(currentGroup.get().getPolicies().contains(policy2), is(true));

        policyService.removePolicyForGroup(policy.getId(), group.getId());

        currentGroup = groupService.findById(group.getId());
        assertThat(currentGroup.get().getPolicies().contains(policy), is(false));
        assertThat(currentGroup.get().getPolicies().contains(policy2), is(true));
    }
}
