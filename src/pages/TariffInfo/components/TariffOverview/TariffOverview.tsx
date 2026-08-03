import { useCallback, useState, type FormEvent } from "react";
import { Button, Chips, Col, Icon, Popover, Row, Text, Title } from "@sber-orm/ui-kit";
import { useTranslation } from "react-i18next";
import type { FeedbackId, ModuleId, TariffContract } from "@/@types/tariff";
import { TariffDetailsModal } from "@/pages/TariffInfo/components/TariffDetailsModal";
import classes from "./styles.module.scss";

interface TariffOverviewProps {
  contract: TariffContract;
  onFeedback: (feedbackId: FeedbackId) => void;
}

interface ModulePopoverState {
  moduleId: ModuleId;
  anchor: HTMLElement;
}

export const TariffOverview = ({ contract, onFeedback }: TariffOverviewProps) => {
  const { t } = useTranslation("tariff");
  const [popover, setPopover] = useState<ModulePopoverState | null>(null);
  const [tariffDetailsOpen, setTariffDetailsOpen] = useState(false);

  const handleModuleClick = useCallback(
    (moduleId: string, event: FormEvent<HTMLElement>) => {
      setPopover({ moduleId: moduleId as ModuleId, anchor: event.currentTarget });
    },
    [],
  );
  const closePopover = useCallback(() => setPopover(null), []);
  const handleServiceAction = useCallback(() => {
    onFeedback("service_opened");
    setPopover(null);
  }, [onFeedback]);

  const selectedModule = popover
    ? contract.modules.find((module) => module.id === popover.moduleId) ?? null
    : null;
  const currentCompanyName =
    contract.companies.find((company) => company.current)?.name ??
    contract.companies[0]?.name;
  const includedModules = contract.modules.filter((module) => module.includedInContract);
  const excludedModules = contract.modules.filter((module) => !module.includedInContract);
  const canOpenSelectedModule = Boolean(
    selectedModule?.includedInContract && selectedModule.roleAvailable,
  );

  return (
    <Row direction="column" gutter={24} align="stretch">
      <Row direction="column" gutter={24} align="stretch" className={classes.summaryCard}>
        <Row direction="column" gutter={4} align="top">
          <Title size="H500">{currentCompanyName}</Title>
        </Row>
        <Row gutter={16} align="stretch" wrap className={classes.summaryGrid}>
          <Col className={classes.summaryColumn}>
            <Button
              variant="function"
              fullWidth
              className={`${classes.summaryPanel} ${classes.tariffPanel}`}
              aria-label={t("summary.tariffDetails", { tariff: contract.tariffName })}
              onClick={() => setTariffDetailsOpen(true)}
            >
              <Row direction="column" gutter={12} align="stretch" className={classes.tariffPanelContent}>
              <Row justify="between" gutter={16} align="bottom">
                <Row direction="column" gutter={4} align="stretch">
                  <Text size="sm" className={classes.label}>{t("summary.tariff")}</Text>
                  <Title size="H500">{contract.tariffName}</Title>
                </Row>
                <Row noFlex align="middle" justify="center"
                  className={classes.tariffDetailsButton}
                  aria-hidden
                >
                  <Icon name="next" width={20} height={20} />
                </Row>
              </Row>
              <Text size="sm" className={classes.label}>
                {contract.startsAt}–{contract.endsAt}
              </Text>
              </Row>
            </Button>
          </Col>
          <Col className={classes.summaryColumn}>
            <Row direction="column" gutter={12} align="stretch" className={classes.summaryPanel}>
              <Row direction="column" gutter={4} align="stretch">
                <Text size="sm" className={classes.label}>{t("summary.contract")}</Text>
                <Title size="H500" className={classes.statusValue}>{t("summary.active")}</Title>
              </Row>
              <Text size="sm" className={classes.label}>
                {t("summary.contractShortNumber", { number: contract.contractNumber })}
              </Text>
            </Row>
          </Col>
        </Row>
      </Row>

      <Row direction="column" gutter={16} align="stretch" className={classes.section}>
        <Row gutter={8} noFlex align="middle">
          <Title size="H500">{t("companies.title")}</Title>
          <Title size="H500" className={classes.sectionCount}>
            {contract.companies.length}
          </Title>
        </Row>
        <Row gutter={8} wrap>
          {contract.companies.map((company) => (
            <span key={company.id} className={classes.companyChip}>
              <Chips
                size="XS"
                selected={company.current}
                item={{
                  id: company.id,
                  title: company.current
                    ? `${company.name} · ${t("companies.current")}`
                    : company.name,
                }}
              />
            </span>
          ))}
        </Row>
      </Row>

      <Row direction="column" gutter={16} align="stretch" className={classes.section}>
        <Row gutter={8} noFlex align="middle">
          <Title size="H500">{t("modules.title")}</Title>
          <Title size="H500" className={classes.sectionCount}>
            {contract.modules.length}
          </Title>
        </Row>
        <Row direction="column" gutter={12} align="stretch">
          <Row direction="column" gutter={8} align="stretch">
            <Text size="sm" className={classes.moduleGroupLabel}>
              {t("modules.included", { count: includedModules.length })}
            </Text>
            <Row gutter={8} wrap>
              {includedModules.map((module) => (
                <span
                  key={module.id}
                  className={module.roleAvailable ? undefined : classes.unavailableModuleChip}
                >
                  <Chips
                    size="XS"
                    item={{ id: module.id, title: module.name }}
                    variant={module.roleAvailable ? "outline" : "fill"}
                    onChange={handleModuleClick}
                  />
                </span>
              ))}
            </Row>
          </Row>
          {excludedModules.length > 0 && (
            <Row direction="column" gutter={8} align="stretch">
              <Text size="sm" className={classes.moduleGroupLabel}>
                {t("modules.excluded", { count: excludedModules.length })}
              </Text>
              <Row gutter={8} wrap>
                {excludedModules.map((module) => (
                  <span key={module.id} className={classes.unavailableModuleChip}>
                    <Chips
                      size="XS"
                      item={{ id: module.id, title: module.name }}
                      variant="fill"
                      onChange={handleModuleClick}
                    />
                  </span>
                ))}
              </Row>
            </Row>
          )}
        </Row>
      </Row>

      {popover && selectedModule && (
        <Popover
          anchor={popover.anchor}
          open
          placement="bottom-start"
          onClose={closePopover}
          title={selectedModule.name}
        >
          <Row direction="column" gutter={12} align="stretch" className={classes.modulePopover}>
            <Row direction="column" gutter={8} align="stretch">
              <Text size="md">{selectedModule.description}</Text>
              {!selectedModule.includedInContract && (
                <Text size="md" className={classes.unavailableText}>
                  {t("modules.unavailableByContract")}
                </Text>
              )}
              {selectedModule.includedInContract && !selectedModule.roleAvailable && (
                <Text size="md" className={classes.unavailableText}>
                  {t("modules.unavailableByRole")}
                </Text>
              )}
            </Row>
            <Button
              size="S"
              variant="secondary"
              iconAfter="external"
              disabled={!canOpenSelectedModule}
              onClick={handleServiceAction}
              className={classes.moduleAction}
            >
              {canOpenSelectedModule
                ? t("modules.serviceAction")
                : selectedModule.includedInContract
                  ? t("modules.actionDisabled")
                  : t("modules.notIncludedAction")}
            </Button>
          </Row>
        </Popover>
      )}
      <TariffDetailsModal
        contract={contract}
        open={tariffDetailsOpen}
        onClose={() => setTariffDetailsOpen(false)}
      />
    </Row>
  );
};
