from rest_framework.metadata import SimpleMetadata


class GroupMetadata(SimpleMetadata):

    def determine_metadata(self, request, view):
        metadata = super(GroupMetadata,
                         self).determine_metadata(request, view)
        metadata['actions'] = {
            "POST": {
                "id": {
                    "type": "integer",
                    "required": False,
                    "read_only": True,
                    "label": "ID"
                },
                "name": {
                    "type": "string",
                    "required": True,
                    "read_only": False,
                    "label": "Name",
                    "max_length": 50
                },
                "members": {
                    "type": "field",
                    "required": True,
                    "read_only": True,
                    "label": "Members"
                },
            }
        }
        return metadata
