import { useCallback, useState } from "react";
import { Badge, Button, Col, Icon, Row, Text, Title } from "@sber-orm/ui-kit";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";

const NAV_ITEMS = [
  { id: "home", icon: "home", active: true },
  { id: "events", icon: "incident", active: false },
  { id: "risks", icon: "risk", active: false },
  { id: "measures", icon: "measure", active: false },
  { id: "analytics", icon: "analytics", active: false },
  { id: "monitoring", icon: "sidebarAi", active: false },
  { id: "limitCampaign", icon: "limitCampaign", active: false },
  { id: "knowledge", icon: "knowledge", active: false },
] as const;

interface TariffSidebarProps {
  companyName: string;
  tariffName: string;
  onSupport: () => void;
}

export const TariffSidebar = ({
  companyName,
  tariffName,
  onSupport,
}: TariffSidebarProps) => {
  const { t } = useTranslation("tariff");
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = useCallback(() => setCollapsed((current) => !current), []);

  return (
    <aside className={`${classes.sidebar} ${collapsed ? classes.collapsed : ""}`}>
      <Col className={classes.sidebarContent}>
        <Row gutter={10} align="middle" noFlex className={classes.brand}>
          <Icon name="normOutlined" width={32} height={32} className={classes.brandIcon} />
          {!collapsed && <Title size="H500">{t("sidebar.brand")}</Title>}
        </Row>

        <Row gutter={10} align="middle" noFlex className={classes.companyCard}>
          <Icon name="business" width={20} height={20} className={classes.secondaryIcon} />
          {!collapsed && (
            <Col className={classes.companyCopy}>
              <Text size="sm" className={classes.secondaryText}>
                {t("sidebar.organization")}
              </Text>
              <Text medium className={classes.ellipsis}>{companyName}</Text>
              <Badge variant="green">{t("sidebar.tariff", { tariff: tariffName })}</Badge>
            </Col>
          )}
        </Row>

        <Col className={classes.navigation}>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.id}
              size="M"
              variant={item.active ? "tertiary" : "ghost"}
              icon={item.icon}
              iconOnly={collapsed}
              aria-label={t(`sidebar.nav.${item.id}`)}
              className={classes.navigationButton}
            >
              {!collapsed ? t(`sidebar.nav.${item.id}`) : undefined}
            </Button>
          ))}
        </Col>

        <Col className={classes.footer}>
          <Row gutter={10} align="middle" noFlex className={classes.profile}>
            <Row align="middle" justify="center" noFlex className={classes.avatar}>
              <Text size="sm" medium>{t("sidebar.profile.initials")}</Text>
            </Row>
            {!collapsed && (
              <Col className={classes.profileCopy}>
                <Text medium className={classes.ellipsis}>{t("sidebar.profile.name")}</Text>
                <Text size="sm" className={`${classes.secondaryText} ${classes.ellipsis}`}>
                  {t("sidebar.profile.role")}
                </Text>
              </Col>
            )}
          </Row>
          <Button
            size="M"
            variant="ghost"
            icon="support"
            iconOnly={collapsed}
            aria-label={t("sidebar.support")}
            className={classes.navigationButton}
            onClick={onSupport}
          >
            {!collapsed ? t("sidebar.support") : undefined}
          </Button>
          <Button
            size="M"
            variant="ghost"
            icon={collapsed ? "arrowRight" : "arrowLeft"}
            iconOnly={collapsed}
            aria-label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
            className={classes.navigationButton}
            onClick={toggleCollapsed}
          >
            {!collapsed ? t("sidebar.collapse") : undefined}
          </Button>
        </Col>
      </Col>
    </aside>
  );
};
