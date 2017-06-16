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
            qin = (qstatic - qcurrent)
            if qin <= 0:
                diff = (qnew - qstatic)
                quantity[1] = (qcurrent + diff)
                quantity[0] = (qstatic + diff)
            else:
                diff = (qstatic - qnew)
                qstatic -= diff
                if qcurrent < diff:
                    qstatic = qin
                    qcurrent = 0
                elif qstatic < qcurrent:
                    qstatic = qcurrent
                    quantity[2] = True
                else:
                    qcurrent -= diff
                quantity[1] = qcurrent # quantity current post 1
                quantity[0] = qstatic # quantity static post 0
            return quantity
        a = oldquantity(5, 10, 4)
        print a
        print a[0]
        print a[1]
        #self.assertEqual(1 + 1, 2)
