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
import {
  getPrimaryRoleId,
  getUserAvatarTone,
  getUserInitials,
  isPaidUser,
  isStaleUser,
} from "@/helpers/tariff";
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
  const initials = getUserInitials(user.fullName);
  const avatarTone = getUserAvatarTone(user.id);
  const stale = isStaleUser(user, SCENARIO_NOW);
  const paid = isPaidUser(user);

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
      align="top"
      className={classes.userRow}
    >
      <Row gutter={16} align="middle" wrap className={classes.userContent}>
        <Row gutter={12} align="middle" className={classes.identity}>
          <Row
            justify="center"
            align="middle"
            className={classes.avatar}
            data-tone={avatarTone}
            aria-hidden
          >
            <Text size="sm" medium className={classes.avatarText}>{initials}</Text>
          </Row>
          <Row direction="column" gutter={2} align="top" className={classes.identityCopy}>
            <Text medium className={classes.userName}>{user.fullName}</Text>
            <Row gutter={8} align="middle" className={classes.roleLine}>
              <Text size="sm" className={classes.role}>{t(`roles.${primaryRoleId}`)}</Text>
              {stale && (
                <Row gutter={4} align="middle" className={classes.stale}>
                  <Icon
                    name="clock"
                    width={12}
                    height={12}
                    className={classes.staleIcon}
                  />
                  <Text size="sm" className={classes.staleText}>{t("users.stale")}</Text>
                </Row>
              )}
            </Row>
          </Row>
        </Row>

        <Row gutter={4} align="middle" className={classes.emailActions}>
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

        <Row gutter={16} justify="between" align="middle" className={classes.details}>
          <Row noFlex justify="end" className={classes.badgeSlot}>
            <Badge variant={paid ? "violet" : "gray"}>
              {paid ? t("users.tariff") : t("users.guest")}
            </Badge>
          </Row>
          <Text size="sm" className={stale ? classes.staleDate : classes.date}>
            {user.lastLogin}
          </Text>
        </Row>
      </Row>

      <Row noFlex align="middle" className={classes.switchSlot}>
        <Switch
          checked={user.status === "active"}
          disabled={permissionMode === "view"}
          inputProps={{ "aria-label": t("access.switchLabel", { name: user.fullName }) }}
          onChange={handleStatusChange}
        />
      </Row>
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
    <Row direction="column" gutter={8} align="stretch" className={classes.list}>
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
