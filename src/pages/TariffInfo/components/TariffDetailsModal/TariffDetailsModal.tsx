import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Text,
  Title,
} from "@sber-orm/ui-kit";
import { useTranslation } from "react-i18next";
import type { TariffContract } from "@/@types/tariff";
import classes from "./styles.module.scss";

interface TariffDetailsModalProps {
  contract: TariffContract;
  open: boolean;
  onClose: () => void;
}

export const TariffDetailsModal = ({ contract, open, onClose }: TariffDetailsModalProps) => {
  const { t } = useTranslation("tariff");

  return (
    <Modal open={open} onClose={onClose} width={720}>
      <ModalHeader
        showCloseButton
        closeButtonProps={{ onClick: onClose, "aria-label": t("modal.close") }}
      >
        {t("modal.tariffTitle")}
      </ModalHeader>
      <ModalBody className={classes.body}>
        <Row direction="column" gutter={16} align="stretch">
          <Row direction="column" gutter={8} align="stretch">
            <Title size="H700">«{contract.tariffName}»</Title>
            <Text size="md" className={classes.description}>{contract.description}</Text>
          </Row>
          <div className={classes.divider} />
          <Row direction="column" gutter={16} align="stretch">
            <Text size="md">{contract.details.userTerms}</Text>
            <Text size="md">{t("modal.aiIntro")}</Text>
            <Row direction="column" gutter={12} align="stretch">
              {contract.details.aiSolutions.map((solution) => (
                <Row key={solution.id} gutter={10} align="top" className={classes.solution}>
                  <Row noFlex justify="center" align="middle" className={classes.check} aria-hidden>
                    <Icon name="check" width={14} height={14} />
                  </Row>
                  <Text size="md">
                    <strong>{solution.title}:</strong> {solution.description}
                  </Text>
                </Row>
              ))}
            </Row>
            <Text size="md">{contract.details.support}</Text>
          </Row>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button size="M" variant="secondary" fullWidth onClick={onClose}>
          {t("modal.understood")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
