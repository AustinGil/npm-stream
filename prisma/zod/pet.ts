import * as z from "zod"
import { CompletePerson, RelatedPersonModel } from "./index"

export const PetModel = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  birthday: z.date(),
})

export interface CompletePet extends z.infer<typeof PetModel> {
  owner: CompletePerson[]
}

/**
 * RelatedPetModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPetModel: z.ZodSchema<CompletePet> = z.lazy(() => PetModel.extend({
  owner: RelatedPersonModel.array(),
}))
