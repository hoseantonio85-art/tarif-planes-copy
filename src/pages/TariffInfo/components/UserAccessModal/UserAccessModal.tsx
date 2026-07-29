import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Text } from "@sber-orm/ui-kit";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";

interface UserAccessModalProps {
  kind: "deactivate" | null;
  onClose: () => void;
  onConfirmDeactivation: () => void;
}

export const UserAccessModal = ({
  kind,
  onClose,
  onConfirmDeactivation,
}: UserAccessModalProps) => {
  const { t } = useTranslation("tariff");
  return (
    <Modal open={kind === "deactivate"} onClose={onClose} width={552}>
      <ModalHeader
        showCloseButton
        closeButtonProps={{ onClick: onClose, "aria-label": t("modal.close") }}
      >
        {t("modal.deactivateTitle")}
      </ModalHeader>
      <ModalBody className={classes.body}>
        <Text>{t("modal.deactivateMessage")}</Text>
      </ModalBody>
      <ModalFooter>
        <Row gutter={16} className={classes.footer}>
          <Button size="M" variant="secondary" onClick={onClose} className={classes.action}>
            {t("modal.cancel")}
          </Button>
          <Button size="M" variant="danger" onClick={onConfirmDeactivation} className={classes.action}>
            {t("modal.deactivate")}
          </Button>
        </Row>
      </ModalFooter>
    </Modal>
  );
};
