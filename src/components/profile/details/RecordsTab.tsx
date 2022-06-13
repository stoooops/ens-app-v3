import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { useCopied } from '@app/hooks/useCopied'
import { mq, Typography } from '@ensdomains/thorin'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { TabWrapper as OriginalTabWrapper } from '../TabWrapper'

type TextRecord = {
  key: string
  value: string
}

type AddressRecord = {
  key: string
  coin: string
  addr: string
}

type ContentHash =
  | {
      protocolType?: any
      decoded?: any
      error?: any
    }
  | null
  | string

const TabWrapper = styled(OriginalTabWrapper)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
    padding: ${theme.space['4.5']};
    ${mq.md.min(css`
      padding: ${theme.space['6']};
      gap: ${theme.space['6']};
      flex-gap: ${theme.space['6']};
    `)}
  `,
)

const RecordSection = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: stretch;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const SectionHeader = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: ${theme.space.full};
    padding: 0 ${theme.radii.large};
  `,
)

const SectionTitleContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const SectionTitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.foreground};
  `,
)

const SectionSubtitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const EditButton = styled.button(
  ({ theme }) => css`
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    color: ${theme.colors.accent};
    font-size: ${theme.fontSizes.base};
  `,
)

const RecordContainer = styled.button(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    background: rgba(0, 0, 0, 0.04);
    padding: ${theme.space['1.5']} ${theme.space['3']};
    border-radius: ${theme.radii.large};
    font-size: calc(${theme.fontSizes.small} - ${theme.space.px});
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    &:active {
      background: rgba(0, 0, 0, 0.04);
      transform: translateY(0);
    }

    ${mq.md.min(css`
      font-size: ${theme.fontSizes.small};
    `)}
  `,
)

const RecordKey = styled(Typography)(
  ({ theme }) => css`
    width: ${theme.space['20']};
    min-width: ${theme.space['20']};
    height: ${theme.space.full};
    align-self: flex-start;
    flex-direction: column;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    overflow-wrap: break-word;
    word-break: break-all;

    ${mq.md.min(css`
      width: ${theme.space['28']};
      min-width: ${theme.space['28']};
    `)}
  `,
)

const CopyButtonWrapper = styled.div(
  () => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
)

const RecordValue = styled(Typography)<{ $fullWidth: boolean }>(
  ({ theme, $fullWidth }) => css`
    max-width: calc(
      100% - ${$fullWidth ? '0px' : theme.space['20']} - ${theme.space['9']} -
        ${$fullWidth ? theme.space['2'] : theme.space['4']}
    );

    ${mq.md.min(css`
      max-width: calc(
        100% - ${$fullWidth ? '0px' : theme.space['28']} - ${theme.space['9']} -
          ${$fullWidth ? theme.space['2'] : theme.space['4']}
      );
    `)}
    display: inline-block;
    overflow-wrap: break-word;
    word-break: break-all;
    word-wrap: break-word;
    text-align: left;
  `,
)

const InnerCopyButton = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['9']};
  `,
)

const LegacyType = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const RecordItem = ({
  itemKey,
  value,
  showLegacy,
}: {
  itemKey?: string
  value: string
  showLegacy?: boolean
}) => {
  const { copy, copied } = useCopied()

  return (
    <RecordContainer onClick={() => copy(value)}>
      {itemKey && (
        <RecordKey weight="bold">
          {showLegacy ? itemKey.replace('_LEGACY', '') : itemKey}
          <LegacyType weight="bold" variant="label">
            {showLegacy && 'LEGACY'}
          </LegacyType>
        </RecordKey>
      )}
      <RecordValue $fullWidth={!itemKey}>{value}</RecordValue>
      <CopyButtonWrapper>
        <InnerCopyButton>
          <IconCopyAnimated color="textTertiary" copied={copied} size="3.5" />
        </InnerCopyButton>
      </CopyButtonWrapper>
    </RecordContainer>
  )
}

export const RecordsTab = ({
  texts,
  addresses,
  contentHash,
  canEdit,
}: {
  texts?: TextRecord[]
  addresses?: AddressRecord[]
  contentHash?: ContentHash
  canEdit?: boolean
}) => {
  const filteredTexts = useMemo(
    () => texts?.filter(({ value }) => value),
    [texts],
  )
  const filteredAddresses = useMemo(
    () => addresses?.filter(({ addr }) => addr),
    [addresses],
  )

  const formattedContentHash = useMemo(() => {
    if (contentHash) {
      if (typeof contentHash === 'string') {
        return contentHash
      }
      if (typeof contentHash === 'object' && contentHash.decoded) {
        return `${contentHash.protocolType}://${contentHash.decoded}`
      }
    }
    return undefined
  }, [contentHash])

  return (
    <TabWrapper>
      <RecordSection>
        <SectionHeader>
          <SectionTitleContainer>
            <SectionTitle weight="bold">Text</SectionTitle>
            <SectionSubtitle weight="bold">
              {filteredTexts ? filteredTexts.length : 0} Records
            </SectionSubtitle>
          </SectionTitleContainer>
          <EditButton>
            {canEdit && <Typography weight="bold">Edit</Typography>}
          </EditButton>
        </SectionHeader>
        {filteredTexts &&
          filteredTexts.map((text) => (
            <RecordItem key={text.key} itemKey={text.key} value={text.value} />
          ))}
      </RecordSection>
      <RecordSection>
        <SectionHeader>
          <SectionTitleContainer>
            <SectionTitle weight="bold">Address</SectionTitle>
            <SectionSubtitle weight="bold">
              {filteredAddresses ? filteredAddresses.length : 0} Records
            </SectionSubtitle>
          </SectionTitleContainer>
        </SectionHeader>
        {filteredAddresses &&
          filteredAddresses.map((address) => (
            <RecordItem
              key={address.key}
              itemKey={address.coin}
              value={address.addr}
              showLegacy={address.coin.endsWith('_LEGACY')}
            />
          ))}
      </RecordSection>
      <RecordSection>
        <SectionHeader>
          <SectionTitleContainer>
            {formattedContentHash ? (
              <SectionTitle weight="bold">Content Hash</SectionTitle>
            ) : (
              <SectionSubtitle weight="bold">No Content Hash</SectionSubtitle>
            )}
          </SectionTitleContainer>
        </SectionHeader>
        {formattedContentHash && <RecordItem value={formattedContentHash} />}
      </RecordSection>
    </TabWrapper>
  )
}