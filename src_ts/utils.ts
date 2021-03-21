import {Step} from './clientTypes'
const fetch = require('node-fetch')

export const getFeedback = async (description: String, tinkID: String) => {
    const MAKE_FEEDBACK = `mutation MyMutation {
      insert_Feedback(objects: {description: "${description}" ${tinkID ? `, tink: "${tinkID}"` : ''}}) {
        returning {
          id
        }
      }
    }`
    console.log('Making feedback: ', description);
    const madeFeedback = await fetchGraphQL(MAKE_FEEDBACK)
    console.log('Finished feedback: ', description, '. ID: ', madeFeedback.data.insert_Feedback.returning[0].id);

    return madeFeedback.data.insert_Feedback.returning[0].id
}

export const makeTinkProcess = async (steps: Step[]) => {
  const website = steps[0].content!
  const tinkID = await getTink(website)


  for (const index in steps) {
    getStepAction(steps[index]).then((stepActionID: String) => 
      makeStep(steps[index], tinkID,  stepActionID, Number(index))
    )
  }
  
  return tinkID
}

export const getTink = async (website: String): Promise<String> => {
    const MAKE_TINK = `
    mutation MyMutation {
      insert_Tink(objects: {website: "${website}"}) {
        returning {
          id
        }
      }
    }
    `
    console.log('Making tink: ', website);
    const madeTink = await fetchGraphQL(MAKE_TINK)
    console.log('Finished tink: ', website, '. ID: ', madeTink.data.insert_Tink.returning[0].id);

    return madeTink.data.insert_Tink.returning[0].id
}

export const getWebsite = async (domain: String): Promise<String> => {
    const FIND_WEBSITE = `
    query MyQuery {
      Website(where: {domain: {_eq: "${domain}"}}) {
        id
      }
    }
    `
    console.log('Finding website: ', domain);
    const foundWebsite = await fetchGraphQL(FIND_WEBSITE)

    if (foundWebsite.data.Website[0]) {
        console.log('Found website: ', domain, '. ID: ', foundWebsite.data.Website[0].id);
        return foundWebsite.data.Website[0].id
    }

    const MAKE_WEBSITE = `
    mutation MyMutation {
      insert_Website(objects: {domain: "${domain}"}) {
        returning {
          id
        }
      }
    }
    `
    console.log('Making website: ', domain);
    const madeWebsite = await fetchGraphQL(MAKE_WEBSITE)
    console.log(madeWebsite);
    console.log('Finished website: ', domain, '. ID: ', madeWebsite.data.insert_Website.returning[0].id);
    
    return madeWebsite.data.insert_Website.returning[0].id
}

export const makeStep = async (step: Step, tinkID: String, stepActionID: String, index: Number): Promise<String> => {
    const MAKE_STEP = `
    mutation MyMutation {
      insert_Step(objects: {index: ${index}, stepAction: "${stepActionID}", tink: "${tinkID}"${step.totalSelected ? `, totalSelected: ${step.totalSelected}` : ''}}) {
        returning {
          id
        }
      }
    }
    `
    console.log('Making step: ', index);
    const madeStep = await fetchGraphQL(MAKE_STEP)
    console.log('Finished step: ', index, '. ID: ', madeStep.data.insert_Step.returning[0].id);

    return madeStep.data.insert_Step.returning[0].id
}

export const getStepAction = async (step: Step): Promise<String> => {
  const recordActionsFindSchema = step.recordedClicksAndKeys ? step.recordedClicksAndKeys.map((ra, index) => 
      ` _and: {RecordActions: {index: {_eq: ${index}}, isClick: {_eq: ${Boolean(ra.selector)}}, selector: {_eq: "${ra.selector || ra.input }"}}`
  ) : ''
  const optionsFindSchema = step.options ? step.options.map(op => op ?
      `, _and: {Options: {type: {_eq: "${op.type}"}${op.value ? `, value: {_eq: "${op.value}"}` : null}}`
  : '') : ''

  const andTotalSchema = '}'.repeat(step.recordedClicksAndKeys ? step.recordedClicksAndKeys.length : 0 + step.options.length)

  const FIND_STEP_ACTION = `
  query {
      StepAction(where: {
        action: {_eq: "${step.action}"}, selector: {_eq: "${step.selector}"}, tagName: {_eq: "${step.tagName}"}
        ${recordActionsFindSchema}
        ${optionsFindSchema}
      ${andTotalSchema}
      }) {
        id
      }
  }
  `

  const foundStepAction = await fetchGraphQL(FIND_STEP_ACTION)

  
  console.log('Finding StepAction: ', step.selector);
  if (foundStepAction.data.StepAction[0]) {
    console.log('Finished StepAction: ', step.selector, '. ID: ', foundStepAction.data.StepAction[0].id);
    return foundStepAction.data.StepAction[0].id
  }

  const recordActionsMakeSchema = step.recordedClicksAndKeys ? step.recordedClicksAndKeys.map((ra, index) =>
      `{index: ${index}, isClick: ${Boolean(ra.selector)}, selector: "${ra.selector || ra.input}"},`
  ) : ''
  const optionsMakeSchema = step.options.length ? step.options.map(op => op ?
      `{type: "${op.type}", value: "${op.value}"},`
  : '') : ''

  const MAKE_STEP_ACTION = `
  mutation {
    insert_StepAction(objects: {
      action: "${step.action}", selector: "${step.selector}", tagName: "${step.tagName}",
      RecordActions: {data: [
          ${recordActionsMakeSchema}
      ]},
      Options: {data: [
          ${optionsMakeSchema}
      ]}
  }) {
      returning {
        id
      }
    }
  }
  `

  console.log('Making StepAction: ', step.selector);
  console.log(MAKE_STEP_ACTION);
  const madeStepAction = await fetchGraphQL(MAKE_STEP_ACTION)
  console.log(madeStepAction);
  console.log('Finished StepAction: ', step.selector, '. ID: ', madeStepAction.data.insert_StepAction.returning[0].id);

  return madeStepAction.data.insert_StepAction.returning[0].id
}

export const fetchGraphQL = async (schema: String) => {
    var graphql = JSON.stringify({
        query: schema,
        variables: {}
    })
    var requestOptions = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'aRjtmnouR7ue0kvluCyqk5h1SHlyc65lfeK2DcdiRFIRcXx43tvTmjb5EUhB5jIT'
        },
        body: graphql,
    };
    const database_url = 'https://tinkingdb.hasura.app/v1/graphql'
    const res = await fetch(database_url, requestOptions).then((res: any) => res.json())
    return res
}