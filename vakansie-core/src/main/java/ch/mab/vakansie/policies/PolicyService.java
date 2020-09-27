package ch.mab.vakansie.policies;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.util.Pair;

public interface PolicyService {

    Set<Policy> findAllPoliciesByGroupId(UUID groupId);

    Set<Pair<Policy, Set<LocalDate>>> checkPoliciesForGroupId(UUID groupId);

    Policy createPolicyForGroup(Policy policy, UUID groupId);

    void removePolicyForGroup(UUID policyId, UUID groupId);

    Policy updatePolicy(UUID policyId, Policy newPolicy);
}
