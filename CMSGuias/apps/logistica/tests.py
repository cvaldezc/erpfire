"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import SimpleTestCase


class TestResta(SimpleTestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        def oldquantity(qcurrent, qstatic, qnew):

            quantity = [0, 0, False]
            if qnew > qstatic:
                diff = (qnew - qstatic)
                quantity[1] = (qcurrent + diff)
                quantity[0] = (qstatic + diff)
            else:
                qin = (qstatic - qcurrent)
                if qnew <= qin:
                    qstatic = qin
                    qcurrent = 0
                    quantity[2] = True
                else:
                    qstatic = qnew
                    qcurrent = (qnew - qin)
                quantity[1] = qcurrent # quantity current post 1
                quantity[0] = qstatic # quantity static post 0
            return quantity
        result = oldquantity(10, 10, 8)
        print result
        print result[0]
        print result[1]
        self.assertEqual(result[0], 8)
