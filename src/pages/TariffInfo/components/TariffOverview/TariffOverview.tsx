import { useCallback, useState, type FormEvent } from "react";
import { Button, Chips, Col, Popover, Row, Text, Title } from "@sber-orm/ui-kit";
import { useTranslation } from "react-i18next";
import type { FeedbackId, ModuleId, TariffContract } from "@/@types/tariff";
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

  return (
    <Row direction="column" gutter={24} align="stretch">
      <Row direction="column" gutter={24} align="stretch" className={classes.summaryCard}>
        <Row direction="column" gutter={4} align="top">
          <Title size="H500">{currentCompanyName}</Title>
          <Text size="md" className={classes.description}>{contract.description}</Text>
        </Row>
        <Row gutter={16} align="stretch" wrap className={classes.summaryGrid}>
          <Col className={classes.summaryColumn}>
            <Row direction="column" gutter={12} align="stretch" className={classes.summaryPanel}>
              <Row direction="column" gutter={4} align="stretch">
                <Text size="sm" className={classes.label}>{t("summary.tariff")}</Text>
                <Title size="H500">{contract.tariffName}</Title>
              </Row>
              <Text size="sm" className={classes.label}>
                {contract.startsAt}–{contract.endsAt}
              </Text>
            </Row>
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
          <Text bold className={classes.sectionCount}>{contract.companies.length}</Text>
        </Row>
        <Row gutter={8} wrap>
          {contract.companies.map((company) => (
            <Chips
              key={company.id}
              size="XS"
              selected={company.current}
              item={{
                id: company.id,
                title: company.current
                  ? `${company.name} · ${t("companies.current")}`
                  : company.name,
              }}
            />
          ))}
        </Row>
      </Row>

      <Row direction="column" gutter={16} align="stretch" className={classes.section}>
        <Row gutter={8} noFlex align="middle">
          <Title size="H500">{t("modules.title")}</Title>
          <Text bold className={classes.sectionCount}>{contract.modules.length}</Text>
        </Row>
        <Row gutter={8} wrap>
          {contract.modules.map((module) => (
            <Chips
              key={module.id}
              size="XS"
              item={{ id: module.id, title: module.name }}
              variant={module.roleAvailable ? "fill" : "outline"}
              onChange={handleModuleClick}
            />
          ))}
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
          <Row direction="column" gutter={16} align="stretch" className={classes.modulePopover}>
            {selectedModule.description && <Text size="sm">{selectedModule.description}</Text>}
            {!selectedModule.roleAvailable && (
              <Text size="sm" className={classes.unavailableText}>
                {t("modules.unavailableByRole")}
              </Text>
            )}
            <Button
              size="S"
              variant="secondary"
              iconAfter="external"
              disabled={!selectedModule.roleAvailable}
              onClick={handleServiceAction}
              className={classes.moduleAction}
            >
              {selectedModule.roleAvailable
                ? t("modules.serviceAction")
                : t("modules.actionDisabled")}
            </Button>
          </Row>
        </Popover>
      )}
    </Row>
  );
};
