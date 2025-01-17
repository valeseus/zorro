import {Button} from '@chakra-ui/button'
import {Spacer, Text} from '@chakra-ui/layout'
import {CircularProgress} from '@chakra-ui/progress'
import {Heading, VStack} from '@chakra-ui/react'
import {navigate, Redirect, routes} from '@redwoodjs/router'
import {MetaTags, useMutation} from '@redwoodjs/web'
import React, {useContext} from 'react'
import UserContext from 'src/layouts/UserContext'
import ipfsClient from 'src/lib/ipfs'
import {dataUrlToBlob, isLocalUrl} from 'src/lib/util'
import {useAppSelector} from 'src/state/store'
import {
  UpdateUnsubmittedProfileMutation,
  UpdateUnsubmittedProfileMutationVariables,
} from 'types/graphql'
import SignUpLogo from '../SignUpLogo'

const SubmitPage = ({initialSubmitProgress = -1}) => {
  const {ethereumAddress} = useContext(UserContext)
  if (!ethereumAddress) return <Redirect to={routes.signUpIntro()} />

  const [submitProgress, setSubmitProgress] = React.useState(
    initialSubmitProgress
  )
  const submitting = submitProgress >= 0
  const signUpState = useAppSelector((state) => state.signUp)

  if (signUpState.photo == null || signUpState.video == null)
    return <Redirect to={routes.signUpRecord()} />

  const [updateMutation] = useMutation<
    UpdateUnsubmittedProfileMutation,
    UpdateUnsubmittedProfileMutationVariables
  >(gql`
    mutation UpdateUnsubmittedProfileMutation(
      $ethereumAddress: String!
      $input: UpdateUnsubmittedProfileInput!
    ) {
      updateUnsubmittedProfile(
        ethereumAddress: $ethereumAddress
        input: $input
      ) {
        id
      }
    }
  `)

  const submit = React.useCallback(async () => {
    setSubmitProgress(0)

    const photoBlob = isLocalUrl(signUpState.photo)
      ? await dataUrlToBlob(signUpState.photo!)
      : null
    const videoBlob = isLocalUrl(signUpState.video)
      ? await dataUrlToBlob(signUpState.video!)
      : null

    const reportProgress = (bytes: number) =>
      setSubmitProgress(
        (100 * bytes) / ((photoBlob?.size ?? 0) + (videoBlob?.size ?? 0))
      )

    const photoCid = photoBlob
      ? (
          await ipfsClient.add(photoBlob, {
            progress: reportProgress,
          })
        ).cid
          .toV1()
          .toString()
      : signUpState.photo!

    const videoCid = videoBlob
      ? (
          await ipfsClient.add(videoBlob, {
            progress: reportProgress,
          })
        ).cid
          .toV1()
          .toString()
      : signUpState.video!

    await updateMutation({
      variables: {
        ethereumAddress,
        input: {
          photoCid,
          videoCid,
        },
      },
    })

    navigate(routes.signUpSubmitted())
  }, [ethereumAddress, updateMutation])

  const title = submitting ? 'Uploading video' : 'Ready to submit'
  return (
    <VStack spacing="6" flex="1" width="100%">
      <SignUpLogo />
      <Heading size="md">{title}</Heading>
      {submitting ? (
        <CircularProgress
          size="6rem"
          value={submitProgress}
          color="purple.500"
        />
      ) : (
        <Text>
          A volunteer community notary will verify your application in
          real-time.
        </Text>
      )}
      <MetaTags title={title} />
      <Spacer display={['initial', 'none']} />
      <Button colorScheme="purple" onClick={submit} disabled={submitting}>
        Submit application
      </Button>
    </VStack>
  )
}

export default SubmitPage
