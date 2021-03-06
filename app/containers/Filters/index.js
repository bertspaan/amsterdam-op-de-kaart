import React from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
import { createSelector } from 'reselect'

import {
  setFilter,
  resetFilters
} from 'containers/App/actions'

import {
  selectFilters,
  selectHasFilters,
  selectGroups
} from 'containers/App/selectors'

import { decadeToPeriod } from 'utils/utils'

import Button from 'components/Button'
import DataPageHeading from 'components/DataPageHeading'

import { StyledForm, Fieldset, Decades, InputContainer } from './styles'

export class Filters extends React.Component {
  render () {
    const groups = this.props.groups || []

    let removeFilters
    if (this.props.hasFilters) {
      removeFilters = <Button onClick={this.resetFilters.bind(this)}>Verwijder filters</Button>
    }

    return (
      <div>
        <DataPageHeading>Zoek kaarten met periode en titel:</DataPageHeading>
        <StyledForm onSubmit={this.handleSubmit.bind(this)} ref='form' aria-controls='data-page-maps-found'>
          <Fieldset>
            <legend>Periode:</legend>
            <Decades>
              { groups.map((group, index) => {
                let checked = true
                const filtered = this.props.filters[`decades-${group}`]
                if (filtered !== undefined) {
                  checked = filtered
                }

                return (
                  <div key={index}>
                    <input type='checkbox' name='decades' id={`filter-decades-${index}`}
                      checked={checked} value={group}
                      onChange={this.handleChange.bind(this)} />
                    <label htmlFor={`filter-decades-${index}`} aria-label={decadeToPeriod(group)} >
                      {group}
                    </label>
                  </div>
                )
              }) }
            </Decades>
          </Fieldset>
          <div>
            <label htmlFor='filter-title'>Titel:</label>
            <InputContainer>
              <input type='text' name='title' value={this.props.filters.title || ''}
                id='filter-title' autoComplete='off'
                placeholder='b.v. "keizersgracht"' onChange={this.handleChange.bind(this)} />
            </InputContainer>
          </div>
          { /*
          <div>
            <label>
              Coordinates
              <input type='text' name='coordinates' onChange={this.handleChange.bind(this)} />
            </label>

            <label>
              Radius
              <input type='range' name='radius' onChange={this.handleChange.bind(this)} />
            </label>
          </div>
          */}
          {removeFilters}
        </StyledForm>
      </div>
    )
  }

  resetFilters () {
    this.props.resetFilters()
  }

  handleSubmit (event) {
    event.preventDefault()
  }

  handleChange (event) {
    const filter = event.target.name
    const value = event.target.value
    if (filter === 'decades') {
      const decadesFilter = `decades-${value}`
      this.props.setFilter(decadesFilter, event.target.checked)
    } else {
      this.props.setFilter(filter, value)
    }
  }

  componentDidMount () {
    this.formElement = findDOMNode(this.refs.form)
  }

}

function mapDispatchToProps (dispatch) {
  return {
    setFilter: (filter, value) => dispatch(setFilter(filter, value)),
    resetFilters: () => dispatch(resetFilters())
  }
}

export default connect(createSelector(
  selectFilters(),
  selectHasFilters(),
  selectGroups(),
  (filters, hasFilters, groups) => ({
    filters, hasFilters, groups
  })
), mapDispatchToProps)(Filters)
