package ch.mab.vakansie.groups;

import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

import ch.mab.vakansie.base.BaseModel;
import java.time.LocalDate;
import java.util.Objects;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;

@Entity
@DiscriminatorColumn
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // default strategy
public class Policy extends BaseModel {

    @Basic
    private boolean repeatsYearly = false; // default

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate start = LocalDate.now().with(firstDayOfYear());

    @Column(nullable = false)
    private LocalDate end = LocalDate.now().with(lastDayOfYear());

    public LocalDate getStart() {
        return start;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return end;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }

    public boolean isRepeatsYearly() {
        return repeatsYearly;
    }

    public void setRepeatsYearly(boolean repeatsYearly) {
        this.repeatsYearly = repeatsYearly;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        Policy policy = (Policy) o;
        return repeatsYearly == policy.repeatsYearly &&
            name.equals(policy.name) &&
            start.equals(policy.start) &&
            end.equals(policy.end);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), repeatsYearly, name, start, end);
    }
}
