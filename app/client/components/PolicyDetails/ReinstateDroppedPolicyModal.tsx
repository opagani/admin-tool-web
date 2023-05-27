import * as React from 'react';
import { useParams } from 'react-router-dom';

import {
  Banner,
  Button,
  ButtonGroup,
  FormField,
  Heading,
  Input,
  Label,
  LabeledControl,
  ModalDialog,
  Paragraph,
  Textarea,
  TextButton,
} from '@zillow/constellation';
import { usePolicyRelatedActionsDetailsAndHistory, useReinstateDroppedPolicy } from './usePolicyDetails';

export const ReinstateDroppedPolicyModal = (props: { close: () => void }) => {
  const [caseNumber, setCaseNumber] = React.useState('');
  const [note, setNote] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const { mutate, status } = useReinstateDroppedPolicy();

  const policyId = useParams<{ policyId: string }>().policyId;
  const policyActions = usePolicyRelatedActionsDetailsAndHistory(policyId);

  const handleOnClick = (close: () => void) => {
    mutate(
      {
        policyId: policyId,
        caseNumber: caseNumber,
        note: note,
      },
      {
        onSuccess: () => {
          setCaseNumber('');
          setNote('');
          setErrorMessage('');
          close();
          policyActions.refetch();
        },
        onError: () => {
          setErrorMessage('There was an error, please try again');
        },
      },
    );
  };

  const content = `You will be re-instating this policy. This will opt the listing back into Rental Protection.`;
  const header = <Heading level={6}>Confirm Reinstating Dropped Policy</Heading>;
  const body = (
    <>
      {errorMessage && <Banner appearance="error" body={errorMessage} />}
      <Paragraph marginX="xl" marginTop="sm" marginBottom="md" style={{ textAlign: 'center' }}>
        {content}
      </Paragraph>
      <FormField>
        <LabeledControl
          labelPosition="left"
          label={<Label>Support Ticket ID</Label>}
          control={
            <Input
              value={caseNumber}
              disabled={status === 'loading'}
              onChange={(event: { target: { value: React.SetStateAction<string> } }) =>
                setCaseNumber(event.target.value)
              }
              size="sm"
              placeholder="Enter Ticket ID"
            />
          }
        />
      </FormField>
      <FormField marginTop="lg" marginBottom="sm">
        <LabeledControl
          labelPosition="left"
          label={<Label style={{ marginRight: '44px' }}>Notes</Label>}
          control={
            <Textarea
              value={note}
              disabled={status === 'loading'}
              onChange={(event: { target: { value: React.SetStateAction<string> } }) => setNote(event.target.value)}
              rows="6"
              placeholder="Enter text"
            />
          }
        />
      </FormField>
    </>
  );
  const footer = (close: () => void) => {
    return (
      <ButtonGroup aria-label="Modal actions">
        <TextButton onClick={close}>Cancel</TextButton>
        <Button
          buttonType="primary"
          disabled={status === 'loading' || !caseNumber || !note}
          onClick={() => handleOnClick(close)}
        >
          Confirm
        </Button>
      </ButtonGroup>
    );
  };

  return (
    <ModalDialog
      {...props}
      size={ModalDialog.SIZES.XS}
      renderHeader={header}
      renderBody={body}
      renderFooter={footer(props.close)}
    />
  );
};
