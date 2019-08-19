import uuid


def create_uuid(model):
    model_id = uuid.uuid4().hex
    while (model.objects.filter(id=model_id).first()):
        model_id = uuid.uuid4().hex
    return model_id
