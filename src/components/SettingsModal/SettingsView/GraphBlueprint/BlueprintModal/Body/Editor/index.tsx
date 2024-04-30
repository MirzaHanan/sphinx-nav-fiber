/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { ClipLoader } from 'react-spinners'
import styled from 'styled-components'
import { TOption } from '~/components/AddItemModal/SourceTypeStep/types'
import { AutoComplete } from '~/components/common/AutoComplete'
import { Flex } from '~/components/common/Flex'
import { Text } from '~/components/common/Text'
import { TextInput } from '~/components/common/TextInput'
import { NODE_ADD_ERROR, requiredRule } from '~/constants'
import { api } from '~/network/api'
import { Schema, getNodeSchemaTypes } from '~/network/fetchSourcesData'
import { useModal } from '~/stores/useModalStore'
import { SubmitErrRes } from '~/types'
import { colors } from '~/utils'
import { CreateCustomNodeAttribute } from './CustomAttributesStep'
import { convertAttributes } from './utils'

const defaultValues = {
  type: '',
  parent: '',
}

export type FormData = {
  type: string
  parent?: string
  node_key: string
  attributes?: {
    [k: string]: string | boolean
  }
}

type Props = {
  onSchemaCreate: (schema: { type: string; parent: string; ref_id: string }) => void
  selectedSchema: Schema | null
  onDelete: (type: string) => void
}

const handleSubmitForm = async (data: FieldValues, isUpdate = false, deletedAttributes: string[]): Promise<void> => {
  try {
    const { attributes, ...withoutAttributes } = data

    const requestData = {
      ...withoutAttributes,
      ...convertAttributes(attributes),
      ...deletedAttributes.reduce<{ [key: string]: string }>((acc, key) => ({ ...acc, [key]: 'delete' }), {}),
    }

    let res: SubmitErrRes

    if (isUpdate) {
      res = await api.put(`/schema`, JSON.stringify(requestData))
    } else {
      res = await api.post(`/schema`, JSON.stringify({ ...requestData, node_key: 'name' }))
    }

    if (res.error) {
      const { message } = res.error

      throw new Error(message)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    let errorMessage = NODE_ADD_ERROR

    if (err instanceof Response && err.status === 400) {
      const error = await err.json()

      errorMessage = error.errorCode || error.status || NODE_ADD_ERROR
    } else if (err instanceof Error) {
      errorMessage = err.message
    }

    throw new Error(errorMessage)
  }
}

export const Editor = ({ onSchemaCreate, selectedSchema, onDelete }: Props) => {
  const { close, visible } = useModal('addType')

  const [isNew, setIsNew] = useState(false)

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: selectedSchema
      ? {
          type: selectedSchema.type,
          parent: selectedSchema.parent,
        }
      : defaultValues,
  })

  const { watch, setValue, reset } = form

  const [loading, setLoading] = useState(false)
  const [parentsLoading, setParentsLoading] = useState(false)
  const [parentOptions, setParentOptions] = useState<TOption[] | null>(null)
  const [deletedAttributes, setDeletedAttributes] = useState<string[]>([])

  useEffect(
    () => () => {
      reset()
    },
    [visible, reset],
  )

  const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

  const handleDeleteAttribute = (attributeKey: string) => {
    setDeletedAttributes((prev) => [...prev, attributeKey])
  }

  useEffect(() => {
    const init = async () => {
      setParentsLoading(true)

      try {
        const data = await getNodeSchemaTypes()

        const schemaOptions = data.schemas
          .filter((schema) => !schema.is_deleted && schema.type)
          .map((schema) =>
            schema?.type === 'thing'
              ? { label: 'No Parent', value: schema.type }
              : {
                  label: capitalizeFirstLetter(schema.type),
                  value: schema.type,
                },
          )

        setParentOptions(schemaOptions)
      } catch (error) {
        console.warn(error)
      } finally {
        setParentsLoading(false)
      }
    }

    if (!selectedSchema) {
      init()
    }
  }, [selectedSchema])

  const parent = watch('parent')

  const handleClose = () => {
    close()
  }

  const handleDelete = async () => {
    if (!selectedSchema?.type) {
      return
    }

    try {
      await api.delete(`/schema/${selectedSchema.type}`)
      onDelete(selectedSchema.type)
      close()
    } catch (error) {
      console.warn(error)
    } finally {
      setIsNew(false)
    }
  }

  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true)

    try {
      await handleSubmitForm(data, !!selectedSchema, deletedAttributes)
      onSchemaCreate({ type: data.type, parent: parent || '', ref_id: selectedSchema?.ref_id || 'new' })
      handleClose()
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorMessage = NODE_ADD_ERROR

      if (err?.status === 400) {
        const errorRes = await err.json()

        errorMessage = errorRes.errorCode || errorRes?.status || NODE_ADD_ERROR
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
    } finally {
      setLoading(false)
      setIsNew(false)
    }
  })

  const resolvedParentValue = () => parentOptions?.find((i) => i.value === parent)

  return (
    <Flex>
      {!isNew && !selectedSchema ? (
        <Flex mt={20}>
          <Button onClick={() => setIsNew(true)}>Create new</Button>
        </Flex>
      ) : (
        <Flex>
          <FormProvider {...form}>
            <form id="add-type-form" onSubmit={onSubmit}>
              <Flex>
                <Flex align="center" direction="row" justify="space-between" mb={18}>
                  <Flex align="center" direction="row">
                    <Text>Enter details</Text>
                  </Flex>
                </Flex>
                {!selectedSchema ? (
                  <>
                    <Flex mb={20}>
                      <Text>Select Parent</Text>
                    </Flex>
                    <Flex direction="row" mb={20}>
                      <AutoComplete
                        key={parent}
                        autoFocus={!selectedSchema}
                        disabled={parentsLoading}
                        isLoading={parentsLoading}
                        onSelect={(e) => setValue('parent', e?.value || '')}
                        options={parentOptions}
                        selectedValue={resolvedParentValue()}
                      />
                    </Flex>
                  </>
                ) : (
                  <Flex mb={20}>
                    <Text kind="headingBold">Parent: {selectedSchema.parent}</Text>
                  </Flex>
                )}

                {!selectedSchema ? (
                  <>
                    <Flex mb={4}>
                      <Text>Type name</Text>
                    </Flex>
                    <Flex mb={12}>
                      <TextInput
                        id="cy-item-name"
                        maxLength={250}
                        name="type"
                        placeholder="Enter type name"
                        rules={{
                          ...requiredRule,
                        }}
                        value={parent}
                      />
                    </Flex>
                  </>
                ) : (
                  <Flex mb={20}>
                    <Text kind="headingBold">Type: {selectedSchema.type}</Text>
                  </Flex>
                )}
              </Flex>
              <CreateCustomNodeAttribute
                onDelete={handleDeleteAttribute}
                parent={selectedSchema ? selectedSchema.type : parent}
              />{' '}
              <Flex direction="row" justify="space-between" mt={20}>
                {selectedSchema ? (
                  <DeleteButton
                    color="secondary"
                    onClick={handleDelete}
                    size="large"
                    style={{ marginRight: 20 }}
                    variant="contained"
                  >
                    Delete
                  </DeleteButton>
                ) : null}

                <Button
                  color="secondary"
                  disabled={loading}
                  onClick={onSubmit}
                  size="large"
                  startIcon={loading ? <ClipLoader color={colors.white} size={24} /> : null}
                  variant="contained"
                >
                  Save
                </Button>
              </Flex>
            </form>
          </FormProvider>
        </Flex>
      )}
    </Flex>
  )
}

const DeleteButton = styled(Button)`
  && {
    color: ${colors.primaryRed};
    background-color: rgba(237, 116, 116, 0.1);

    &:hover,
    &:active,
    &:focus {
      color: ${colors.primaryRed};
      background-color: rgba(237, 116, 116, 0.2);
    }
  }
`
