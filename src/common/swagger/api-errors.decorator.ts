import { applyDecorators } from '@nestjs/common';

import {
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ApiErrors() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized. JWT token missing or invalid.',
    }),

    ApiForbiddenResponse({
      description: 'Forbidden. User does not have permission.',
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error.',
    }),
  );
}
