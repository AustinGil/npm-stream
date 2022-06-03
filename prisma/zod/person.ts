import * as z from "zod"
import { CompletePet, RelatedPetModel } from "./index"

export const PersonModel = z.object({
  id: z.string(),
  name: z.string(),
})

export interface CompletePerson extends z.infer<typeof PersonModel> {
  pet: CompletePet[]
}

/**
 * RelatedPersonModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPersonModel: z.ZodSchema<CompletePerson> = z.lazy(() => PersonModel.extend({
  pet: RelatedPetModel.array(),
}))
