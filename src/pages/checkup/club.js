import React, { Component } from 'react'
import Login from 'components/auth/Login'
import LoadingBar from 'components/LoadingBar'
import ErrorPage from 'components/admin/ErrorPage'
import Nav from 'components/apply/ApplyNav'
import ClubForm from 'components/checkup/ClubForm'
import api from 'api'
import search from 'search'
import { Container, Card, Heading } from '@hackclub/design-system'
import Layout from 'components/Layout'

export default class extends Component {
  state = {
    status: 'loading'
  }

  componentDidMount() {
    const id = search.get('id')
    api
      .get(`v1/new_clubs/${id}`)
      .then(club => {
        const positions = club.leadership_positions.concat(
          club.leadership_position_invites
        )
        this.setState({ club, positions, status: 'success' })
      })
      .catch(err => {
        console.error(err)
        if (err.status === 401) {
          this.setState({ status: 'needsToAuth' })
        } else {
          this.setState({ status: 'error' })
        }
      })
  }

  render() {
    const { status, club } = this.state
    switch (status) {
      case 'loading':
        return <LoadingBar fill />
      case 'success':
        return (
          <Layout>
            <Nav breadcrumb={false} />
            <Container color="black" p={3} maxWidth={36}>
              <Heading.h2 fontSize={5} mt={4}>
                Confirm your club info
              </Heading.h2>
              <Card boxShadowSize="md" p={3} my={3}>
                <ClubForm
                  {...club}
                  redirectUrl={`${window.location.origin}/checkup/leaders?id=${
                    club.id
                  }`}
                />
              </Card>
            </Container>
          </Layout>
        )
      case 'needsToAuth':
        return <Login heading="Sign in to view" />
      default:
        return <ErrorPage />
    }
  }
}
