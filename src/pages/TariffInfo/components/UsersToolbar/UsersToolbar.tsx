import { useCallback, useMemo, useRef } from "react";
import {
  Button,
  Chips,
  FieldSearch,
  Popover,
  RadioChips,
  Row,
  Switch,
  Text,
  Title,
} from "@sber-orm/ui-kit";
import { useTranslation } from "react-i18next";
import type { AppliedUserFilters, QuickFilter, RoleId } from "@/@types/tariff";
import classes from "./styles.module.scss";

interface UsersToolbarProps {
  quickFilter: QuickFilter;
  setQuickFilter: (filter: QuickFilter) => void;
  searchOpen: boolean;
  toggleSearch: () => void;
  query: string;
  setQuery: (query: string, matchingRoleIds: readonly RoleId[]) => void;
  filterOpen: boolean;
  openFilters: () => void;
  closeFilters: () => void;
  draftFilters: AppliedUserFilters;
  setDraftStatus: (status: AppliedUserFilters["status"]) => void;
  setDraftRole: (roleId: AppliedUserFilters["roleId"]) => void;
  setDraftStale: (staleOnly: boolean) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  roleIds: readonly RoleId[];
}

export const UsersToolbar = ({
  quickFilter,
  setQuickFilter,
  searchOpen,
  toggleSearch,
  query,
  setQuery,
  filterOpen,
  openFilters,
  closeFilters,
  draftFilters,
  setDraftStatus,
  setDraftRole,
  setDraftStale,
  resetFilters,
  applyFilters,
  roleIds,
}: UsersToolbarProps) => {
  const { t } = useTranslation("tariff");
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const quickItems = useMemo(
    () => [
      { id: "all", title: t("toolbar.all") },
      { id: "in_tariff", title: t("toolbar.tariff") },
      { id: "not_billable", title: t("toolbar.notBillable") },
    ],
    [t],
  );
  const statusItems = useMemo(
    () => [
      { id: "all", title: t("toolbar.anyStatus") },
      { id: "active", title: t("toolbar.active") },
      { id: "deactivated", title: t("toolbar.deactivated") },
    ],
    [t],
  );
  const roleItems = useMemo(
    () => [
      { id: "all", title: t("toolbar.anyRole") },
      ...roleIds.map((roleId) => ({ id: roleId, title: t(`roles.${roleId}`) })),
    ],
    [roleIds, t],
  );

  const handleQuickChange = useCallback(
    (id: string) => setQuickFilter(id as QuickFilter),
    [setQuickFilter],
  );
  const handleSearchChange = useCallback(
    (value: string) => {
      const normalizedValue = value.trim().toLocaleLowerCase("ru");
      const matchingRoleIds = normalizedValue
        ? roleIds.filter((roleId) =>
            t(`roles.${roleId}`).toLocaleLowerCase("ru").includes(normalizedValue),
          )
        : [];
      setQuery(value, matchingRoleIds);
    },
    [roleIds, setQuery, t],
  );
  const handleStatusChange = useCallback(
    (id: string) => setDraftStatus(id as AppliedUserFilters["status"]),
    [setDraftStatus],
  );
  const handleRoleChange = useCallback(
    (id: string) => setDraftRole(id as AppliedUserFilters["roleId"]),
    [setDraftRole],
  );
  const handleStaleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setDraftStale(event.target.checked),
    [setDraftStale],
  );

  return (
    <Row direction="column" gutter={12} align="stretch">
      <Row justify="between" gutter={16} wrap className={classes.toolbar}>
        <RadioChips
          items={quickItems}
          value={quickFilter}
          kind="primary"
          color="gray"
          onChange={handleQuickChange}
          wrap
        />
        <Row gutter={8} noFlex>
          <Button
            size="S"
            variant="tertiary"
            icon="search"
            iconOnly
            aria-label={t("toolbar.search")}
            onClick={toggleSearch}
          />
          <Button
            ref={filterButtonRef}
            size="S"
            variant="tertiary"
            icon="filter"
            onClick={openFilters}
          >
            {t("toolbar.filter")}
          </Button>
        </Row>
      </Row>

      {searchOpen && (
        <FieldSearch
          search={{ value: query }}
          handleChange={handleSearchChange}
          label=""
          placeholder={t("toolbar.searchPlaceholder")}
          size="M"
          fullWidth
        />
      )}

      {filterOpen && filterButtonRef.current && (
        <Popover
          anchor={filterButtonRef.current}
          open
          placement="bottom-end"
          onClose={closeFilters}
        >
          <Row direction="column" gutter={20} align="stretch" className={classes.filterPopover}>
            <Title size="H400">{t("toolbar.filterTitle")}</Title>
            <Row direction="column" gutter={8} align="stretch">
              <Text size="sm" bold className={classes.filterLabel}>
                {t("toolbar.status")}
              </Text>
              <Row gutter={4} wrap>
                {statusItems.map((item) => (
                  <Chips
                    key={item.id}
                    size="XS"
                    variant="outline"
                    item={item}
                    selected={draftFilters.status === item.id}
                    onChange={handleStatusChange}
                  />
                ))}
              </Row>
            </Row>
            <Row direction="column" gutter={8} align="stretch">
              <Text size="sm" bold className={classes.filterLabel}>
                {t("toolbar.role")}
              </Text>
              <Row gutter={4} wrap>
                {roleItems.map((item) => (
                  <Chips
                    key={item.id}
                    size="XS"
                    variant="outline"
                    item={item}
                    selected={draftFilters.roleId === item.id}
                    onChange={handleRoleChange}
                  />
                ))}
              </Row>
            </Row>
            <Row
              justify="between"
              align="middle"
              gutter={16}
              className={classes.filterToggle}
            >
              <Text size="md" bold>{t("toolbar.staleOnly")}</Text>
              <Switch
                checked={draftFilters.staleOnly}
                onChange={handleStaleChange}
                size="md"
                inputProps={{ "aria-label": t("toolbar.staleOnly") }}
              />
            </Row>
            <Row gutter={8} className={classes.filterActions}>
              <Button
                size="S"
                variant="secondary"
                fullWidth
                className={classes.filterAction}
                onClick={resetFilters}
              >
                {t("toolbar.reset")}
              </Button>
              <Button
                size="S"
                variant="primary"
                fullWidth
                className={classes.filterAction}
                onClick={applyFilters}
              >
                {t("toolbar.apply")}
              </Button>
            </Row>
          </Row>
        </Popover>
      )}
    </Row>
  );
};
