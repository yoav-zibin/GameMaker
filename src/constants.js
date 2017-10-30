const constants = {
  IMAGE_ID_IDENTIFIER: 'imageId',
  IS_BOARD_IMAGE_IDENTIFIER: 'isBlock',
  IMAGE_PATH_IDENTIFIER: 'imagePath',
  IMAGE_UPLOAD_SUCCESSFUL: 'Image uploaded succesfully',
  IMAGE_UPLOAD_FAILED: 'Image upload failed',
  CERTIFY_IMAGE_STATEMENT:
    'I certify that I have the rights to use this image in an open source project',
  NO_FILE_SELECTED_WARNING: 'No file selected',
  NO_BOARD_SELECTED_ERROR: 'You must select a board',
  NO_IMAGE_SELECTED_ERROR: 'You must select an image for the element',
  MAX_WIDTH_HEIGHT_WARNING:
    'Max of width and height for board image should be 1024',
  NOT_CERTIFIED_WARNING: 'Certification is necessary to move forward',
  BOARD_IMAGE_TOGGLE_LABEL: 'Is this a board image?',
  IMAGE_ID_FLOATING_LABEL: 'Enter image name',
  IMAGE_ID_HINT_TEXT: 'Image name',
  SPEC_NAME_FLOATING_LABEL: "Enter spec's name",
  SPEC_NAME_HINT_TEXT: "Spec's name",
  SPEC_UPLOAD_SUCCESSFUL: 'Spec uploaded successfully',
  SPEC_UPLOAD_FAILED: 'Spec Upload failed',
  EXISTING_SPEC_NAME_ERROR: 'Spec name already exists',
  NO_SPEC_NAME_ERROR: 'No spec name specified',
  ELEMENT_CREATE_SUCCESSFUL: 'Element created successfully',
  ELEMENT_CREATE_FAILED: 'Element created failed',
  ELEMETN_DIFFERENT_WIDTH_HEIGHT:
    'All the images must have the same width&height',
  EXCEED_ELEMENT_IMAGES_LIMIT:
    'Only one image is allowed in this kind of element',
  LESS_THAN_ELEMENT_IMAGES_LIMIT: 'At least two images in this kind of element',
  DICE_IMAGE_NUM_LIMIT: '6^n images in dice',
  CARD_IMAGE_NUM_LIMIT: 'Card must contains only two images',
  PIECE_SIZE_FLOATING_LABEL: 'Enter piece image size',
  PIECE_SIZE_HINT_TEXT: 'Piece Image Size',
  NAV_UPLOAD_IMAGE_TEXT: 'Upload Image',
  NAV_GAME_SPEC_BUILDER_TEXT: 'Spec Builder',
  NAV_CREATE_ELEMENT_TEXT: 'Create Element',
  TITLE_TEXT: 'Game Builder',
  AUTHENTICATION_LOCAL_STORAGE_KEY: 'GAME_BUILDER_LOCAL_STORAGE_$UID',
  IMAGES_PATH: 'images',
  SPECS_PATH: 'specs',
  ELEMENTS_PATH: 'elements',
  JSON_MALFORMED_ERROR: 'Current JSON is malformed: ',
  PROPER_FORMAT_ACCEPTED_WARNING: 'Upload proper format, accepted formats are ',
  ACCEPTED_IMAGE_FORMATS: '.png,.jpg,.jpeg,.svg,.gif'
};

export default constants;
