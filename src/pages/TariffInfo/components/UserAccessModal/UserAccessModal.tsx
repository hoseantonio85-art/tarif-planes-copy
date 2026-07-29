import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Text } from "@sber-orm/ui-kit";
import { useTranslation } from "react-i18next";
import type { TariffUser } from "@/@types/tariff";
import classes from "./styles.module.scss";

interface UserAccessModalProps {
  kind: "deactivate" | null;
  user: TariffUser | null;
  onClose: () => void;
  onConfirmDeactivation: () => void;
}

export const UserAccessModal = ({
  kind,
  user,
  onClose,
  onConfirmDeactivation,
}: UserAccessModalProps) => {
  const { t } = useTranslation("tariff");
  return (
    <Modal open={kind === "deactivate"} onClose={onClose} width={520}>
      <ModalHeader
        showCloseButton
        closeButtonProps={{ onClick: onClose, "aria-label": t("modal.close") }}
      >
        {t("modal.deactivateTitle")}
      </ModalHeader>
      <ModalBody className={classes.body}>
        <Text>
          {t("modal.deactivateMessage", { name: user?.fullName })}
        </Text>
      </ModalBody>
      <ModalFooter>
        <Row gutter={12} justify="end" className={classes.footer}>
          <Button variant="secondary" onClick={onClose}>
            {t("modal.cancel")}
          </Button>
          <Button variant="danger" onClick={onConfirmDeactivation}>
            {t("modal.deactivate")}
          </Button>
        </Row>
      </ModalFooter>
    </Modal>
  );
};
