/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { useAvatar } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import {
  RegistrationStatus,
  useRegistrationStatus,
} from '@app/hooks/useRegistrationStatus'
import { useZorb } from '@app/hooks/useZorb'
import { shortenAddress } from '@app/utils/utils'
import { Avatar, Spinner, Tag, Typography } from '@ensdomains/thorin'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled, { css } from 'styled-components'

const SearchItem = styled.div<{
  $selected?: boolean
  $clickable?: boolean
  $error?: boolean
}>(
  ({ theme, $selected, $clickable, $error }) => css`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['2']};
    height: ${theme.space['14']};
    padding: 0 ${theme.space['4']};
    border-bottom: ${theme.borderWidths['0.375']} ${theme.borderStyles.solid}
      ${theme.colors.borderTertiary};
    &:last-of-type {
      border-bottom: 0;
    }
    position: relative;
    opacity: 0.6;
    ${$clickable &&
    css`
      cursor: pointer;
    `}
    ${$selected &&
    css`
      background-color: ${theme.colors.background};
      opacity: 1;
    `}
    ${$error &&
    css`
      background-color: rgba(${theme.accentsRaw.red}, 0.1);
      color: ${theme.colors.red};
    `}
    ${$clickable &&
    $selected &&
    css`
      padding-right: ${theme.space['8']};
      &::after {
        content: '';
        transform: rotate(-90deg);
        mask-image: url('data:image/svg+xml; utf8, <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2552 17.8659C11.6526 18.3095 12.3474 18.3095 12.7448 17.8659L22.5063 6.97001C23.0833 6.32597 22.6262 5.30274 21.7615 5.30274H2.2385C1.37381 5.30274 0.916704 6.32597 1.49369 6.97001L11.2552 17.8659Z" fill="currentColor"/></svg>');
        position: absolute;
        height: ${theme.space['3']};
        width: ${theme.space['3']};
        background-color: ${theme.colors.foreground};
        opacity: 0.4;
        right: ${theme.space['3']};
      }
    `}
  `,
)

const NoInputYetTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const AvatarWrapper = styled.div<{ $isPlaceholder?: boolean }>(
  ({ theme, $isPlaceholder }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['8']};
    min-width: ${theme.space['8']};
    height: ${theme.space['8']};
    flex-grow: 1;
    ${$isPlaceholder &&
    css`
      filter: grayscale(100%);
    `}
  `,
)

const LeadingSearchItem = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    max-width: min-content;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    gap: ${theme.space['4.5']};
    flex-gap: ${theme.space['4.5']};
  `,
)

const AddressAndName = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  `,
)

const StyledTag = styled(Tag)(
  () => css`
    width: max-content;
    justify-self: flex-end;
    overflow-wrap: normal;
    word-break: keep-all;
    white-space: nowrap;
  `,
)

const AddressTag = styled(StyledTag)(
  ({ theme }) => css`
    border: ${theme.borderWidths['0.375']} solid ${theme.colors.borderSecondary};
    background-color: transparent;
  `,
)

const AddressPrimary = styled.div(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.label};
    color: ${theme.colors.textSecondary};
  `,
)

const SpinnerWrapper = styled.div(
  () => css`
    width: max-content;
    justify-self: flex-end;
  `,
)

const AddressResultItem = ({ address }: { address: string }) => {
  const primary = usePrimary(address)
  const network = useChainId()
  const { avatar } = useAvatar(primary.name || undefined, network)
  const zorb = useZorb(address, 'address')

  return (
    <>
      <LeadingSearchItem>
        <AvatarWrapper>
          <Avatar src={avatar || zorb} label="avatar" />
        </AvatarWrapper>
        <AddressAndName>
          <Typography weight="bold">
            {shortenAddress(address, undefined, 8, 6)}
          </Typography>
          {primary.name && <AddressPrimary>{primary.name}</AddressPrimary>}
        </AddressAndName>
      </LeadingSearchItem>
      <AddressTag>Address</AddressTag>
    </>
  )
}

const GracePeriodTag = styled(StyledTag)(
  ({ theme }) => css`
    color: ${theme.colors.yellow};
    background-color: rgba(${theme.accentsRaw.yellow}, 0.1);
  `,
)

const PremiumTag = styled(StyledTag)(
  ({ theme }) => css`
    color: ${theme.colors.purple};
    background-color: rgba(${theme.accentsRaw.purple}, 0.1);
  `,
)

const StatusTag = ({ status }: { status: RegistrationStatus }) => {
  switch (status) {
    case 'registered': {
      return <StyledTag>Registered</StyledTag>
    }
    case 'gracePeriod': {
      return <GracePeriodTag>Grace Period</GracePeriodTag>
    }
    case 'premium': {
      return <PremiumTag>Temporary Premium</PremiumTag>
    }
    case 'available': {
      return <StyledTag tone="green">Available</StyledTag>
    }
    case 'notOwned': {
      return <StyledTag tone="blue">Not Owned</StyledTag>
    }
    case 'notImported': {
      return <StyledTag tone="blue">Not Imported</StyledTag>
    }
    case 'short': {
      return <StyledTag tone="red">Too Short</StyledTag>
    }
    default: {
      return <StyledTag tone="red">Invalid</StyledTag>
    }
  }
}

const TextWrapper = styled.div(
  () => css`
    overflow: hidden;
    text-align: left;
    & > div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: clip;
      text-align: left;
      direction: rtl;
      &::before {
        content: '‎';
      }
    }
  `,
)

const PlaceholderResultItem = ({ input }: { input: string }) => {
  const zorb = useZorb('placeholder', 'name')

  return (
    <>
      <LeadingSearchItem>
        <AvatarWrapper $isPlaceholder>
          <Avatar src={zorb} label="name" />
        </AvatarWrapper>
        <TextWrapper>
          <Typography weight="bold">{input}</Typography>
        </TextWrapper>
      </LeadingSearchItem>
      <SpinnerWrapper>
        <Spinner color="accent" />
      </SpinnerWrapper>
    </>
  )
}

const NameResultItem = ({ name }: { name: string }) => {
  const network = useChainId()
  const { avatar } = useAvatar(name, network)
  const zorb = useZorb(name, 'name')
  const { data: status } = useRegistrationStatus(name)

  return (
    <>
      <LeadingSearchItem>
        <AvatarWrapper>
          <Avatar src={avatar || zorb} label="name" />
        </AvatarWrapper>
        <TextWrapper>
          <Typography weight="bold">{name}</Typography>
        </TextWrapper>
      </LeadingSearchItem>
      {status ? (
        <StatusTag status={status} />
      ) : (
        <SpinnerWrapper>
          <Spinner color="accent" />
        </SpinnerWrapper>
      )}
    </>
  )
}

type SearchItemType = 'text' | 'error' | 'address' | 'name' | 'nameWithDotEth'

export const SearchResult = ({
  type,
  value,
  hoverCallback,
  clickCallback,
  index,
  selected,
  usingPlaceholder = true,
}: {
  type: SearchItemType
  value: string
  hoverCallback: (index: number) => void
  clickCallback: (index: number) => void
  index: number
  selected: number
  usingPlaceholder?: boolean
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: MouseEvent) => e.preventDefault()

  const handleClick = useCallback(() => {
    clickCallback(index)
  }, [index, clickCallback])

  useEffect(() => {
    const wrapper = wrapperRef.current
    wrapper?.addEventListener('mousedown', handleMouseDown)
    wrapper?.addEventListener('click', handleClick)
    return () => {
      wrapper?.removeEventListener('mousedown', handleMouseDown)
      wrapper?.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  const input = useMemo(() => {
    if (type === 'nameWithDotEth') {
      return `${value!}.eth`
    }
    return value
  }, [type, value])

  const clickable = useMemo(() => {
    if (type === 'name' || type === 'nameWithDotEth') {
      const labels = input.split('.')
      const isDotETH = labels.length === 2 && labels[1] === 'eth'
      if (isDotETH && labels[0].length < 3) {
        return false
      }
    }
    return true
  }, [input, type])

  const props = useMemo(
    () => ({
      ref: wrapperRef,
      onMouseEnter: () => hoverCallback(index),
      $selected: index === selected,
      $clickable: clickable,
    }),
    [index, hoverCallback, selected, clickable],
  )

  if (usingPlaceholder && type !== 'error' && type !== 'text') {
    return (
      <SearchItem {...props}>
        <PlaceholderResultItem input={input} />
      </SearchItem>
    )
  }

  if (type === 'address') {
    return (
      <SearchItem {...props}>
        <AddressResultItem address={input} />
      </SearchItem>
    )
  }

  if (type === 'name' || type === 'nameWithDotEth') {
    return (
      <SearchItem {...props}>
        <NameResultItem name={input} />
      </SearchItem>
    )
  }

  if (type === 'error') {
    return (
      <SearchItem $selected $error>
        <Typography weight="bold">{value}</Typography>
      </SearchItem>
    )
  }

  return (
    <SearchItem>
      <NoInputYetTypography weight="bold">{value}</NoInputYetTypography>
    </SearchItem>
  )
}
