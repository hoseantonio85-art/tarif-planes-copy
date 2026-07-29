import { useCallback, useEffect } from "react";
import {
  Alert,
  Button,
  Col,
  Notification,
  Row,
  Text,
  Title,
  notification,
} from "@sber-orm/ui-kit";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTariffModel } from "@/hooks/useTariffModel";
import {
  SystemAccessState,
  SystemLoadingState,
} from "@/pages/TariffInfo/components/SystemAccessState/SystemAccessState";
import { TariffOverview } from "@/pages/TariffInfo/components/TariffOverview/TariffOverview";
import { TariffSidebar } from "@/pages/TariffInfo/components/TariffSidebar/TariffSidebar";
import { UserAccessModal } from "@/pages/TariffInfo/components/UserAccessModal/UserAccessModal";
import { UsersList } from "@/pages/TariffInfo/components/UsersList/UsersList";
import { UsersToolbar } from "@/pages/TariffInfo/components/UsersToolbar/UsersToolbar";
import classes from "./styles.module.scss";

const TariffInfo = () => {
  const { t } = useTranslation("tariff");
  const navigate = useNavigate();
  const model = useTariffModel();
  const { clearFeedback, feedback, showFeedback } = model;
  const handleBack = useCallback(() => navigate("/"), [navigate]);
  const handleSupport = useCallback(
    () => showFeedback("support_requested"),
    [showFeedback],
  );
  const currentCompanyName =
    model.contract.companies.find((company) => company.current)?.name ??
    model.contract.companies[0]?.name ??
    t("page.title");

  useEffect(() => {
    if (feedback !== "activated") return;
    notification(t("feedback.activated"), { type: "success" });
    clearFeedback();
  }, [clearFeedback, feedback, t]);

  if (model.isLoading) {
    return <SystemLoadingState />;
  }

  if (model.accessState !== "active") {
    return (
      <SystemAccessState
        state={model.accessState}
        feedback={model.feedback}
        onRetry={model.retryProvisioning}
        onFeedback={showFeedback}
        onClearFeedback={clearFeedback}
      />
    );
  }

  return (
    <Row align="stretch" className={classes.pageShell}>
      <div className={classes.sidebarShell}>
        <TariffSidebar
          companyName={currentCompanyName}
          tariffName={model.contract.tariffName}
          onSupport={handleSupport}
        />
      </div>
      <Col className={classes.main}>
        <Row direction="column" gutter={24} align="stretch" className={classes.content}>
          <Row gutter={16} align="middle" className={classes.header}>
            <Button
              size="S"
              variant="ellipse"
              icon="arrowLeft"
              iconOnly
              aria-label={t("page.back")}
              className={classes.backButton}
              onClick={handleBack}
            />
            <Row direction="column" gutter={4} align="top" className={classes.headerCopy}>
              <Text size="sm" className={classes.eyebrow}>{t("page.title")}</Text>
              <Title size="H700">{currentCompanyName}</Title>
            </Row>
          </Row>

          {model.isRefreshing && (
            <Alert status="info" message={t("system.refreshing")} />
          )}

          {feedback && feedback !== "activated" && (
            <Alert
              status="success"
              message={t(`feedback.${feedback}`)}
              onClose={clearFeedback}
            />
          )}

          <TariffOverview contract={model.contract} onFeedback={showFeedback} />

          <Row direction="column" gutter={24} align="stretch" className={classes.usersSection}>
            <Title size="H500">
              {t("users.title", {
                active: model.activePaidUsers,
                max: model.contract.maxPaidUsers,
              })}
            </Title>
            <Row direction="column" gutter={32} align="stretch">
              <Row direction="column" gutter={12} align="stretch">
                <UsersToolbar
                  quickFilter={model.quickFilter}
                  setQuickFilter={model.setQuickFilter}
                  searchOpen={model.searchOpen}
                  toggleSearch={model.toggleSearch}
                  query={model.query}
                  setQuery={model.setQuery}
                  filterOpen={model.filterOpen}
                  openFilters={model.openFilters}
                  closeFilters={model.closeFilters}
                  draftFilters={model.draftFilters}
                  setDraftFilters={model.setDraftFilters}
                  resetFilters={model.resetFilters}
                  applyFilters={model.applyFilters}
                  roleIds={model.roleIds}
                />
                {model.limitWarning && (
                  <Alert
                    status="danger"
                    message={t("users.limitWarning")}
                    onClose={model.clearLimitWarning}
                  />
                )}
              </Row>
              <UsersList
                users={model.filteredUsers}
                permissionMode={model.permissionMode}
                onStatusChange={model.requestUserStatusChange}
              />
            </Row>
          </Row>
        </Row>
      </Col>

      <UserAccessModal
        kind={model.dialog?.kind ?? null}
        user={model.dialogUser}
        onClose={model.closeDialog}
        onConfirmDeactivation={model.confirmDeactivation}
      />
      <div className={classes.notificationHost}>
        <Notification position="top-center" />
      </div>
    </Row>
  );
};

export default TariffInfo;
