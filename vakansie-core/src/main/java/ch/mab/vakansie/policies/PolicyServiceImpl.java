package ch.mab.vakansie.policies;

import ch.mab.vakansie.groups.Group;
import ch.mab.vakansie.groups.GroupRepository;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PolicyServiceImpl implements PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Override
    public Set<Policy> findAllPoliciesByGroupId(UUID groupId) {
        Objects.requireNonNull(groupId);

        Optional<Group> group = groupRepository.findById(groupId);
        return group.get().getPolicies();
    }

    @Override
    public Set<Pair<Policy, Set<LocalDate>>> checkPoliciesForGroupId(UUID groupId) {
        Objects.requireNonNull(groupId);
        return null;
    }

    @Override
    public Policy createPolicyForGroup(Policy policy, UUID groupId) {
        Objects.requireNonNull(policy);
        Objects.requireNonNull(groupId);

        Optional<Group> group = groupRepository.findById(groupId);
        policy = policyRepository.save(policy);
        group.get().addPolicy(policy);
        return policy;
    }

    @Override
    public void removePolicyForGroup(UUID policyId, UUID groupId) {
        Objects.requireNonNull(policyId);
        Objects.requireNonNull(groupId);

        policyRepository.delete(policyRepository.findById(policyId).get());
    }

    @Override
    public Policy updatePolicy(UUID policyId, Policy newPolicy) {
        Objects.requireNonNull(policyId);
        Objects.requireNonNull(newPolicy);

        Optional<Policy> policy = policyRepository.findById(policyId);
        policy.get().setName(newPolicy.getName());
        policy.get().setStart(newPolicy.getStart());
        policy.get().setEnd(newPolicy.getEnd());
        policy.get().setRepeatsYearly(newPolicy.isRepeatsYearly());
        return policy.get();
    }
}
