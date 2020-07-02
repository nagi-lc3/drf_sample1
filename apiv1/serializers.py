from rest_framework import serializers

from shop.models import Book


class BookSerializer(serializers.ModelSerializer):
    """本モデル用のシリアライザ"""

    class Meta:
        model = Book
        fields = ['id', 'title', 'price']
