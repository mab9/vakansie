package ch.mab.vakansie.base;

import java.util.Objects;
import java.util.UUID;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

@MappedSuperclass
public abstract class BaseModel {

    @Id  // Die ID Annotation definiert ob Methoden oder Felder annotiert werden.
    @GeneratedValue(strategy = GenerationType.AUTO) // auto is default value
    private UUID id;

    @Version //  is used to specify the version attribute used for optimistic locking
    private int version;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public long getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        BaseModel baseModel = (BaseModel) o;
        return version == baseModel.version &&
            id.equals(baseModel.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, version);
    }
}
