import { Alert, Button, Icon, Loader, Row, Text, Title } from "@sber-orm/ui-kit";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { FeedbackId, SystemAccessState as AccessState } from "@/@types/tariff";
import classes from "./styles.module.scss";

interface SystemAccessStateProps {
  state: Exclude<AccessState, "active">;
  feedback: FeedbackId | null;
  onRetry: () => void;
  onFeedback: (feedbackId: FeedbackId) => void;
  onClearFeedback: () => void;
}

const stateConfig = {
  pending_provisioning: {
    icon: "clock" as const,
    title: "system.pendingTitle",
    text: "system.pendingText",
    help: "system.pendingHelp",
  },
  deactivated: {
    icon: "lock" as const,
    title: "system.deactivatedTitle",
    text: "system.deactivatedText",
    help: "system.deactivatedHelp",
  },
  provisioning_failed: {
    icon: "attention" as const,
    title: "system.failedTitle",
    text: "system.failedText",
    help: null,
  },
};

export const SystemLoadingState = () => {
  const { t } = useTranslation("tariff");

  return (
    <Row justify="center" align="middle" className={classes.screen}>
      <Row direction="column" gutter={16} align="middle" className={classes.loadingCard}>
        <Loader />
        <Text>{t("system.loading")}</Text>
      </Row>
    </Row>
  );
};

export const SystemAccessState = ({
  state,
  feedback,
  onRetry,
  onFeedback,
  onClearFeedback,
}: SystemAccessStateProps) => {
  const { t } = useTranslation("tariff");
  const config = stateConfig[state];
  const handleSupport = useCallback(() => onFeedback("support_requested"), [onFeedback]);
  const handleSignOut = useCallback(() => onFeedback("signed_out"), [onFeedback]);

  return (
    <Row justify="center" align="middle" className={classes.screen}>
      <Row direction="column" gutter={24} align="middle" className={classes.card}>
        <Row justify="center" className={classes.iconWrap}>
          <Icon name={config.icon} width={32} height={32} />
        </Row>
        <Row direction="column" gutter={12} align="middle">
          <Title size="H700" className={classes.center}>{t(config.title)}</Title>
          <Text className={classes.center}>{t(config.text)}</Text>
          {config.help && <Text className={`${classes.center} ${classes.secondary}`}>{t(config.help)}</Text>}
        </Row>
        {feedback && (
          <Alert
            status="success"
            message={t(`feedback.${feedback}`)}
            onClose={onClearFeedback}
          />
        )}
        <Row gutter={12} wrap justify="center">
          {state === "provisioning_failed" && (
            <Button icon="refresh" onClick={onRetry}>{t("system.retry")}</Button>
          )}
          <Button variant="secondary" icon="support" onClick={handleSupport}>
            {t("system.support")}
          </Button>
          {state !== "provisioning_failed" && (
            <Button variant="ghost" icon="signOut" onClick={handleSignOut}>
              {t("system.signOut")}
            </Button>
          )}
        </Row>
      </Row>
    </Row>
  );
};
