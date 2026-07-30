import { useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from "react";
import {
  Button,
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
  setDraftFilters: Dispatch<SetStateAction<AppliedUserFilters>>;
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
  setDraftFilters,
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
      { id: "out_of_tariff", title: t("toolbar.guest") },
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
    (id: string) =>
      setDraftFilters((current) => ({
        ...current,
        status: id as AppliedUserFilters["status"],
      })),
    [setDraftFilters],
  );
  const handleRoleChange = useCallback(
    (id: string) =>
      setDraftFilters((current) => ({
        ...current,
        roleId: id as AppliedUserFilters["roleId"],
      })),
    [setDraftFilters],
  );
  const handleStaleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setDraftFilters((current) => ({ ...current, staleOnly: event.target.checked })),
    [setDraftFilters],
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
              <Text size="sm" bold>{t("toolbar.status")}</Text>
              <RadioChips
                items={statusItems}
                value={draftFilters.status}
                onChange={handleStatusChange}
                wrap
              />
            </Row>
            <Row direction="column" gutter={8} align="stretch">
              <Text size="sm" bold>{t("toolbar.role")}</Text>
              <RadioChips
                items={roleItems}
                value={draftFilters.roleId}
                onChange={handleRoleChange}
                wrap
              />
            </Row>
            <Switch
              checked={draftFilters.staleOnly}
              label={t("toolbar.staleOnly")}
              onChange={handleStaleChange}
              size="sm"
            />
            <Row gutter={8} justify="end">
              <Button size="S" variant="ghost" onClick={resetFilters}>
                {t("toolbar.reset")}
              </Button>
              <Button size="S" onClick={applyFilters}>
                {t("toolbar.apply")}
              </Button>
            </Row>
          </Row>
        </Popover>
      )}
    </Row>
  );
};
