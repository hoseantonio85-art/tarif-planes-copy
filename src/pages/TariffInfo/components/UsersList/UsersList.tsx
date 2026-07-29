import { useCallback } from "react";
import {
  Badge,
  Button,
  Icon,
  Row,
  Switch,
  Text,
  notification,
  useCopyToClipboard,
} from "@sber-orm/ui-kit";
import { useTranslation } from "react-i18next";
import type { PermissionMode, RoleId, TariffUser } from "@/@types/tariff";
import { getPrimaryRoleId, isStaleUser } from "@/helpers/tariff";
import { SCENARIO_NOW } from "@/data/tariffFixtures";
import classes from "./styles.module.scss";

interface UserRowProps {
  user: TariffUser;
  permissionMode: PermissionMode;
  onStatusChange: (userId: string) => void;
}

const UserRow = ({ user, permissionMode, onStatusChange }: UserRowProps) => {
  const { t } = useTranslation("tariff");
  const copyToClipboard = useCopyToClipboard();
  const primaryRoleId: RoleId = getPrimaryRoleId(user);
  const stale = isStaleUser(user, SCENARIO_NOW);

  const handleCopy = useCallback(async () => {
    const copied = await copyToClipboard(user.email, { silent: true });
    if (copied) notification(t("feedback.copied"), { type: "success" });
  }, [copyToClipboard, t, user.email]);
  const handleStatusChange = useCallback(
    () => onStatusChange(user.id),
    [onStatusChange, user.id],
  );

  return (
    <Row
      gutter={16}
      justify="between"
      align="middle"
      wrap
      className={`${classes.userRow} ${user.status === "deactivated" ? classes.userRowMuted : ""}`}
    >
      <Row direction="column" gutter={4} align="top" className={classes.identity}>
        <Text medium>{user.fullName}</Text>
        <div className={classes.identityMeta}>
          <Text size="sm" className={classes.role}>{t(`roles.${primaryRoleId}`)}</Text>
          <Row gutter={4} noFlex align="middle" className={classes.emailActions}>
            <Text size="sm" className={classes.email}>{user.email}</Text>
            <Button
              size="XXS"
              variant="function"
              icon="copy"
              iconOnly
              aria-label={t("aria.copyEmail", { email: user.email })}
              onClick={handleCopy}
            />
          </Row>
        </div>
      </Row>

      <Row gutter={12} wrap className={classes.details}>
        {stale && <Badge variant="yellow">{t("users.stale")}</Badge>}
        <Row gutter={6} noFlex>
          <Icon name="clock" width={16} height={16} />
          <Text size="sm">{user.lastLogin}</Text>
        </Row>
        <Badge variant={user.inTariff ? "green" : "gray"}>
          {user.inTariff ? t("users.inTariff") : t("users.outOfTariff")}
        </Badge>
      </Row>

      <Switch
        checked={user.status === "active"}
        disabled={permissionMode === "view"}
        inputProps={{ "aria-label": t("access.switchLabel", { name: user.fullName }) }}
        onChange={handleStatusChange}
      />
    </Row>
  );
};

interface UsersListProps {
  users: TariffUser[];
  permissionMode: PermissionMode;
  onStatusChange: (userId: string) => void;
}

export const UsersList = ({ users, permissionMode, onStatusChange }: UsersListProps) => {
  const { t } = useTranslation("tariff");

  if (users.length === 0) {
    return (
      <Row justify="center" className={classes.emptyState}>
        <Text className={classes.secondaryText}>{t("users.empty")}</Text>
      </Row>
    );
  }

  return (
    <Row direction="column" gutter={0} align="stretch" className={classes.list}>
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          permissionMode={permissionMode}
          onStatusChange={onStatusChange}
        />
      ))}
    </Row>
  );
};
