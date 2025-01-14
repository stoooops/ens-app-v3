import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { Typography, Space } from '@ensdomains/thorin'

import { useGetFuseData } from '@app/hooks/useGetFuseData'

import { TrafficLight } from '@app/components/TrafficLight'

const FusesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 20px 25px;
`

const FusesRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: ${theme.borderWidths.px} ${theme.borderStyles.solid}
        ${theme.colors.borderTertiary};
    }
  `,
)

const Spacer = styled.div<{ $height: Space }>(
  ({ theme, $height }) => css`
    width: 100%;
    height: ${theme.space[$height]};
  `,
)

const Fuses = () => {
  const router = useRouter()
  const { name } = router.query
  const { fuseData } = useGetFuseData((name as string) || '')

  return !fuseData ? (
    <Typography>Please wrap your name to unlock this feature</Typography>
  ) : (
    <FusesContainer>
      <div>
        <Typography weight="bold" color="textTertiary">
          Permissions
        </Typography>
        <Spacer $height="5" />
        <div>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              Can do everything
            </Typography>
            <TrafficLight
              $go={fuseData.fuseObj.canDoEverything}
              data-testid="first-traffic-light"
            />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              Can burn fuses
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotBurnFuses} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              Can create subdomains
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotCreateSubdomains} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              Can set resolver
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotSetResolver} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              Can set TTL
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotSetTTL} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              Can transfer
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotTransfer} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              Can unwrap
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotUnwrap} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              Parent can control
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.parentCannotControl} />
          </FusesRow>
        </div>
      </div>
      <Spacer $height="10" />
      <div>
        <Typography weight="bold" color="textTertiary">
          Vulnerabilities
        </Typography>
        <Spacer $height="5" />
        <FusesRow>
          <Typography color="textSecondary" weight="bold">
            Vulnerability
          </Typography>
          <Typography color="textSecondary" data-testid="vulnerability">
            {fuseData.vulnerability}
          </Typography>
        </FusesRow>
        <FusesRow>
          <Typography color="textSecondary" weight="bold">
            Vulnerable node
          </Typography>
          <Typography color="textSecondary">
            {fuseData.vulnerableNode ?? 'None'}
          </Typography>
        </FusesRow>
      </div>
    </FusesContainer>
  )
}

export default Fuses
